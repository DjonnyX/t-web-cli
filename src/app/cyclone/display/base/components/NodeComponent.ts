import { Subject, Observable, Subscription } from "rxjs";
import {
  IComponentOptions,
  IComponentDisposeOptions,
  IComponentRemoveChildOptions
} from "../../interfaces";
import { IModule } from "../../../module";
import { mount } from "../../../utils/dom";
import { RuntimeErrors } from "../../../runtime";
import { cyclone, CSerializer } from "../../../core";
import BaseComponent from "./BaseComponent";
import { linkExternalProperty, unlinkExternalProperty } from "./helpers";

/**
 * Basic html-component
 */
export default abstract class NodeComponent<Node> extends BaseComponent {
  public static meta: IComponentOptions;

  protected _parent!: NodeComponent<any>;
  public get parent(): NodeComponent<any> {
    return this._parent;
  }

  protected _children = new Array<NodeComponent<any>>();

  protected _linkedEvents: {
    [eventType: string]: {
      emitter: Subject<any> | undefined;
      executor: (e: Event) => void;
    };
  } = {};

  protected _propsForBinding: {
    [propName: string]: () => any;
  } = {};

  protected _linkedProps: {
    [propName: string]: () => any;
  } = {};

  protected _linkedDOMProps: {
    [propName: string]: () => any;
  } = {};

  protected _linkedElRefs: {
    [name: string]: () => any;
  } = {};

  protected _interactionSubscriptions = Array<Subscription>();

  public markForVerify(): void {
    cyclone.addDeferCall(this._detectChanges);
    for (const child of this._children) {
      child.markForVerify();
    }
  }

  protected _detectChanges = (): void => {
    // NEED PROTECT CALLS IF COMPONENT IS DISPOSED
    // ? MAY BE NEED RECURSIVE | NEED A PROPS TREE ?
    // each propery setter must include caller <code>markForVerify</code>
    this.updateBindedProps();
    this.updateDOMBindedProps();
  };

  protected updateBindedProps(): void {
    const propNames = Object.keys(this._linkedProps);

    for (const propName of propNames) {
      const extProp = this._linkedProps[propName];
      (this as Record<string, any>)[propName] = extProp();
    }
  }

  protected updateDOMBindedProps(): void {
    const propNames = Object.keys(this._linkedDOMProps);

    for (const propName of propNames) {
      const extProp = this._linkedDOMProps[propName];
      (this.nativeElement.element as any)[propName] = extProp();
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

  public readonly linkProperty = <T = any>(
    propName: string,
    externalProperty: () => T
  ): void => {
    linkExternalProperty(this._linkedProps, propName, externalProperty);
  };

  public readonly linkDomProperty = <T = any>(
    propName: string,
    externalProperty: () => T
  ): void => {
    linkExternalProperty(this._linkedDOMProps, propName, externalProperty);
  };

  public readonly linkElRefs = <T = any>(
    propName: string,
    externalProperty: () => T
  ): void => {
    linkExternalProperty(this._linkedElRefs, propName, externalProperty);
  };

  public readonly addInteractionEvent = <T = any>(
    eventName: string
  ): Observable<T> => {
    if (!eventName) {
      throw new Error(RuntimeErrors.EVENT_TYPE_MUST_BE_DEFINED);
    }

    if (!(eventName in this._linkedEvents)) {
      // dom events
      if (eventName in this) {
        const executor = (this as Record<string, any>)[eventName];
        this._linkedEvents[eventName] = { emitter: new Subject<T>(), executor };
      }
      // self events
      else {
        const executor = (e: Event): void => {
          this.emitEvent(eventName, e);
        };
        this.nativeElement.addListener(eventName, e => {
          executor(e);
        });
        this._linkedEvents[eventName] = {
          emitter: new Subject<T>(),
          executor
        };
      }
    }

    return this._linkedEvents[eventName].emitter.asObservable();
  };

  protected _extractEmitter<T = any>(
    eventName: string
  ): Subject<T> | undefined {
    if (!(eventName in this._linkedEvents)) {
      return undefined;
    }
    return this._linkedEvents[eventName].emitter;
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

  public addChild<E extends Node>(
    child: NodeComponent<E>
  ): NodeComponent<E> {
    this._children.push(child);
    child._parent = this;

    mount(this.nativeElement.element as any, child.nativeElement.element as any);

    return child;
  }

  public removeChild<E extends Node = any>(
    child: NodeComponent<E>,
    options: IComponentRemoveChildOptions = { dispose: false }
  ): NodeComponent<E> {
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

  public contains<E extends Node = any>(
    child: NodeComponent<E>
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
    const eventTypes = Object.keys(this._linkedEvents);

    for (const eventType of eventTypes) {
      const emitter = this._extractEmitter(eventType);

      if (!emitter) {
        continue;
      }

      emitter.complete();

      this._linkedEvents[eventType].executor = undefined;
      this._linkedEvents[eventType].emitter = undefined;
      delete this._linkedEvents[eventType];
    }
  }

  protected removeInteractionHandlers(): void {
    while (this._interactionSubscriptions.length) {
      const subscr = this._interactionSubscriptions.shift();
      subscr.unsubscribe();
    }
  }

  protected removeLinkedProps(): void {
    unlinkExternalProperty(this._linkedDOMProps);
    unlinkExternalProperty(this._linkedProps);
    unlinkExternalProperty(this._linkedElRefs);
  }

  public dispose(
    options: IComponentDisposeOptions = { disposeChildren: true }
  ): void {
    this.removeLinkedProps();
    this.removeChildren({ dispose: options.disposeChildren });
    this.removeInteractionHandlers();
    this.removeInteractionEvents();
  }
}
