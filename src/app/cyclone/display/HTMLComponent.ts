import { Subject, Observable, Subscription } from "rxjs";
import {
  IComponentOptions,
  IComponentDisposeOptions,
  IComponentRemoveChildOptions
} from "./interfaces";
import { IModule } from "../module";
import { mount } from "../utils/dom";
import { RuntimeErrors } from "../runtime";
import { cyclone, CSerializer } from "../core";
import { HTMLElementRef, NodeComponent } from "./base";

/**
 * Basic html-component
 */
export default class HTMLComponent<T = any> extends NodeComponent<T> {
  public static meta: IComponentOptions;

  protected _children = new Array<HTMLComponent<any>>();

  protected _parent!: HTMLComponent<any>;
  public get parent(): HTMLComponent<any> {
    return this._parent;
  }

  protected _events: {
    [eventType: string]: {
      emitter: Subject<any> | undefined;
      executor: (e: Event) => void;
    };
  } = {};

  protected _propsForBinding: {
    [propName: string]: () => any;
  } = {};

  protected _bindedProps: {
    [propName: string]: () => any;
  } = {};

  protected _bindedDOMProps: {
    [propName: string]: () => any;
  } = {};

  protected _interactionSubscriptions = Array<Subscription>();

  constructor(options: IComponentOptions = HTMLComponent.meta) {
    super();
    const { selectorName, elementRefType, template } = options;

    this.nativeElement = HTMLElementRef.new({
      elementRefType,
      selectorName
    }) as any;

    if (template && options.cModule) {
      this.injectChildrenFromTemplate(template, options.cModule);
    }
  }

  public markForVerify(): void {
    cyclone.addDeferCall(this._detectChanges);
    for (const child of this._children) {
      child.markForVerify();
    }
  }

  protected _detectChanges = (): void => {
    this.updateBindedProps();
    this.updateDOMBindedProps();
  };

  protected updateBindedProps(): void {
    const propNames = Object.keys(this._bindedProps);

    for (const propName of propNames) {
      const extProp = this._bindedProps[propName];
      (this as Record<string, any>)[propName] = extProp();
    }
  }

  protected updateDOMBindedProps(): void {
    const propNames = Object.keys(this._bindedDOMProps);

    for (const propName of propNames) {
      const extProp = this._bindedDOMProps[propName];
      (this.nativeElement.element as Record<string, any>)[propName] = extProp();
    }
  }

  /**
   * Prepares and returns a property for binding
   */
  public readonly makePropForBinding = <T = any>(
    propName: string
  ): (() => T) => {
    if (!(propName in this._propsForBinding)) {
      this._propsForBinding[propName] = (): T => {
        return (this as Record<string, any>)[propName];
      };
    }
    return this._propsForBinding[propName];
  };

  public readonly bindProperty = <T = any>(
    propName: string,
    externalProperty: () => T
  ): void => {
    if (propName in this._bindedProps) {
      throw new Error(
        RuntimeErrors.PROPERTY__P__ALREADY_BINDED.replace(/\$p/, propName)
      );
    }

    this._bindedProps[propName] = externalProperty;
  };

  public readonly bindDomProperty = <T = any>(
    propName: string,
    externalProperty: () => T
  ): void => {
    if (propName in this._bindedDOMProps) {
      throw new Error(
        RuntimeErrors.PROPERTY__P__ALREADY_BINDED.replace(/\$p/, propName)
      );
    }

    this._bindedDOMProps[propName] = externalProperty;
  };

  public readonly addInteractionEvent = <T = any>(
    eventName: string
  ): Observable<T> => {
    if (!eventName) {
      throw new Error(RuntimeErrors.EVENT_TYPE_MUST_BE_DEFINED);
    }

    if (!(eventName in this._events)) {
      // dom events
      if (eventName in this) {
        const executor = (this as Record<string, any>)[eventName];
        this._events[eventName] = { emitter: new Subject<T>(), executor };
      }
      // self events
      else {
        const executor = (e: Event): void => {
          this.emitEvent(eventName, e);
        };
        this.nativeElement.addListener(eventName, e => {
          executor(e);
        });
        this._events[eventName] = {
          emitter: new Subject<T>(),
          executor
        };
      }
    }

    return this._events[eventName].emitter.asObservable();
  };

  protected _extractEmitter<T = any>(
    eventName: string
  ): Subject<T> | undefined {
    if (!(eventName in this._events)) {
      return undefined;
    }
    return this._events[eventName].emitter;
  }

  /**
   * Emit event to owner
   */
  protected emitEvent<V = any>(eventName: string, value: V): void {
    const emitter = this._extractEmitter(eventName);
    if (!emitter) {
      return;
    }

    emitter.next(value);
  }

  /**
   * called before attaching to the owner
   */
  public beforeAttach(): void {
    // etс
  }

  /**
   * called after attaching to the owner
   */
  public afterAttach = (): void => {
    this.markForVerify();
  };

  public addChild<T = any>(
    child: HTMLComponent<T>
  ): HTMLComponent<T> {
    this._children.push(child);
    child._parent = this;

    mount(this.nativeElement.element, child.nativeElement.element);

    return child;
  }

  public removeChild<T = any>(
    child: HTMLComponent<T>,
    options: IComponentRemoveChildOptions = { dispose: false }
  ): HTMLComponent<T> {
    const index = this._children.indexOf(child);
    if (index > -1) {
      this._children.splice(index, 1);

      if (this._parent) {
        this._parent.removeChild(this);
      }

      if (options.dispose) {
        child.dispose({
          disposeChildren: options.dispose
        });
      }
    }

    return child;
  }

  public removeChildren(
    options: IComponentRemoveChildOptions = { dispose: false }
  ): void {
    while (this._children.length) {
      const child = this._children.shift();
      if (options.dispose) {
        child.dispose({
          disposeChildren: options.dispose
        });
      }
    }
  }

  public contains<T = any>(
    child: HTMLComponent<T>
  ): boolean {
    return this._children.indexOf(child) > -1;
  }

  protected injectChildrenFromTemplate(
    template: string,
    cModule: IModule
  ): void {
    CSerializer.parse(this, template, cModule);
  }

  public readonly bindInteractionHandler = (
    handler: Observable<any>,
    handlerName: string
  ): void => {
    const a = Object.getPrototypeOf(this);
    if (!(handlerName in a)) {
      throw new Error(
        RuntimeErrors.EVENT_HANDLER__E__IS_NOT_EXISTS.replace(
          /\$h/,
          handlerName
        )
      );
    }

    this._interactionSubscriptions.push(
      handler.subscribe((value: any) => {
        (this as Record<string, any>)[handlerName](value);
      })
    );
  };

  /**
   * Removing all interactive eventEmitter's
   */
  protected removeInteractionEvents(): void {
    const eventTypes = Object.keys(this._events);

    for (const eventType of eventTypes) {
      const emitter = this._extractEmitter(eventType);

      if (!emitter) {
        continue;
      }

      emitter.complete();

      this._events[eventType].executor = undefined;
      this._events[eventType].emitter = undefined;
      delete this._events[eventType];
    }
  }

  protected removeInteractionHandlers(): void {
    while (this._interactionSubscriptions.length) {
      const subscr = this._interactionSubscriptions.shift();
      subscr.unsubscribe();
    }
  }

  public dispose(
    options: IComponentDisposeOptions = { disposeChildren: true }
  ): void {
    this.removeChildren({ dispose: options.disposeChildren });
    this.removeInteractionHandlers();
    this.removeInteractionEvents();
  }
}
