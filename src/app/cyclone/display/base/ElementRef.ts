import { RuntimeErrors } from "../../runtime";
import {
  removeAttributes,
  removeChildren,
  removeDomClasses
} from "../../utils/dom";
import IElementRefDisposeOptions from "./interfaces/IElementRefDisposeOptions";
import { IElementRefOptions } from "./interfaces";

const DEFAULT_NATIVE_ELEMENT_TYPE = "div";

/**
 * ElementRef
 * Elements are reused.
 */
export default class ElementRef<E extends keyof HTMLElementTagNameMap = "div"> {
  /**
   * Creating a new native element from pool or direct creation
   * @param {E} type
   */
  public static new<E extends keyof HTMLElementTagNameMap = "div">(
    options?: IElementRefOptions
  ): ElementRef<E> {
    const type = options && options.elementRefType !== undefined ? options.elementRefType : DEFAULT_NATIVE_ELEMENT_TYPE as any;
    const elementRef = this.__fromPool(type);
    if (elementRef) {
      return elementRef;
    }

    return new ElementRef(options);
  }

  protected static __pool = new Map<
    keyof HTMLElementTagNameMap,
    Array<ElementRef<keyof HTMLElementTagNameMap>>
  >();

  /**
   * Put in the pool
   * @param {E} type
   * @param {ElementRef<E>} elementRef
   */
  protected static __fromPool<E extends keyof HTMLElementTagNameMap = "div">(
    type: E
  ): ElementRef<E> | undefined {
    const pool = this.__pool.get(type);
    if (pool && pool.length) {
      const el = pool.shift();
      if (el) {
        return el as ElementRef<E>;
      }
    }

    return undefined;
  }

  /**
   * Put in the pool
   * @param {E} type
   * @param {ElementRef<E>} elementRef
   */
  protected static __toPool<E extends keyof HTMLElementTagNameMap = "div">(
    type: E,
    elementRef: ElementRef<E>
  ): void {
    const pool = ElementRef.__pool.get(type);
    if (!pool) {
      ElementRef.__pool.set(type, [elementRef]);
    } else {
      pool.push(elementRef);
    }
  }

  public readonly type: E;
  public readonly selectorName!: string;

  protected _element!: HTMLElementTagNameMap[E];
  public get element(): HTMLElementTagNameMap[E] {
    return this._element;
  }

  protected _listenerTypesMap = new Map<
    string,
    EventListenerOrEventListenerObject[]
  >();

  /**
   * @param {E} type
   */
  protected constructor(options?: IElementRefOptions) {

    this.type = options && options.elementRefType !== undefined ? options.elementRefType : DEFAULT_NATIVE_ELEMENT_TYPE as any;
    this.selectorName = options && options.selectorName !== undefined ? options.selectorName : this.type;

    this._createNativeElement();
  }

  /**
   * Add listeners
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} options
   */
  public addListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    if (!this._element) {
      throw new Error(RuntimeErrors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    this._element.addEventListener(type, listener, options);

    if (!this._listenerTypesMap.has(type)) {
      this._listenerTypesMap.set(type, []);
    }

    const pool = this._listenerTypesMap.get(type);
    if (pool && pool.indexOf(listener) === -1) {
      pool.push(listener);
    }
  }

  /**
   * Remove listener
   * Note: Here need to work on optimization!
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   */
  public removeListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void {
    if (!this._element) {
      throw new Error(RuntimeErrors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    this._element.removeEventListener(type, listener);

    const pool = this._listenerTypesMap.get(type);
    if (!pool) {
      return;
    }

    const index = pool.indexOf(listener);
    if (index === -1) {
      return;
    }

    pool.splice(index, 1);
  }

  /**
   * Remove all event listeners
   */
  public removeAllListeners(): void {
    if (!this._element) {
      throw new Error(RuntimeErrors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    this._listenerTypesMap.forEach(
      (listeners: EventListenerOrEventListenerObject[], key: string) => {
        while (listeners.length) {
          const listener = listeners.shift();

          if (!(listener && this._element)) {
            continue;
          }

          this._element.removeEventListener(key, listener);
        }
      }
    );

    // clear map
    this._listenerTypesMap.clear();
  }

  public dispose(options?: IElementRefDisposeOptions): void {
    if (!this._element) {
      throw new Error(RuntimeErrors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    ElementRef.__toPool(this.type, this);

    this.removeAllListeners();

    if (!options) {
      return;
    }

    if (options.clearClasses) {
      removeDomClasses(this._element);
    }

    if (options.clearAttribute) {
      removeAttributes(this._element);
    }

    if (options.clearInnerHtml) {
      removeChildren(this._element);
    }

    if (!options.clearAttribute && options.clearInlineStyles) {
      this._element.removeAttribute("style");
    }
  }

  protected _createNativeElement(): void {
    this._element = document.createElement<E>(this.selectorName as any, {is: this.type});
  }
}
