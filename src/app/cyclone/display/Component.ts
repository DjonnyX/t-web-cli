import { Subject, Observable, Subscription } from "rxjs";
import ElementRef from "./base/ElementRef";
import {
  IComponentOptions,
  IComponentDisposeOptions,
  IComponentRemoveChildOptions
} from "./interfaces";
import CSerializer from "../core/serializer/CSerializer";
import { IModule } from "../module";
import { mount } from "../utils/dom";
import { RuntimeErrors } from "../runtime";

/**
 * Basic component
 */
export default class Component<E extends keyof HTMLElementTagNameMap = any> {
  public static meta: IComponentOptions;

  public readonly nativeElement: ElementRef<E>;

  protected _children = new Array<Component<any>>();

  protected _parent!: Component<any>;
  public get parent(): Component<any> {
    return this._parent;
  }

  protected _events: {
    [eventType: string]: {
      emitter: Subject<any> | undefined;
      executor: (e: Event) => void;
    };
  } = {};

  protected _interactionSubscriptions = Array<Subscription>();

  constructor(options: IComponentOptions = Component.meta) {
    const { selectorName, elementRefType, template } = options;

    this.nativeElement = ElementRef.new({
      elementRefType,
      selectorName
    });

    if (template && options.cModule) {
      this.injectChildrenFromTemplate(template, options.cModule);
    }
  }

  public readonly addInteractionEvent = <T = any>(
    eventName: string
  ): Observable<T> => {
    if (!eventName) {
      throw new Error(RuntimeErrors.EVENT_TYPE_MUST_BE_DEFINED);
    }

    if (!(this._events as Record<string, any>).hasOwnProperty(eventName)) {
      // dom events
      if ((this as Record<string, any>).hasOwnProperty(eventName)) {
        const executor = (this as Record<string, any>)[eventName];
        this._events[eventName] = { emitter: new Subject<T>(), executor };
      }
      // self events
      else {
        const executor = (e: Event): void => {
          this.emitEvent(eventName, e);
        }
        this.nativeElement.addListener(eventName, e => {executor(e)});
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
    if (!(this._events as Record<string, any>).hasOwnProperty(eventName)) {
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
  public afterAttach(): void {
    // etс
  }

  public addChild<E extends keyof HTMLElementTagNameMap = any>(
    child: Component<E>
  ): Component<E> {
    this._children.push(child);
    child._parent = this;

    mount(this.nativeElement.element, child.nativeElement.element);

    return child;
  }

  public removeChild<E extends keyof HTMLElementTagNameMap = any>(
    child: Component<E>,
    options: IComponentRemoveChildOptions = { dispose: false }
  ): Component<E> {
    const index = this._children.indexOf(child);
    if (index > -1) {
      this._children.splice(index, 0);

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

  public contains<E extends keyof HTMLElementTagNameMap = any>(
    child: Component<E>
  ): boolean {
    return this._children.indexOf(child) > -1;
  }

  public set innerText(value: string) {
    this.nativeElement.element.innerText = value;
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
    if (!a.hasOwnProperty(handlerName)) {
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

    for (const eventType in eventTypes) {
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
