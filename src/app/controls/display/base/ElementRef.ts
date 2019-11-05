import { Errors } from "../../runtime";
import IElementRefDisposeOptions from "./interfaces/IElementRefDisposeOptions";
import IEventListenerPair from "./interfaces/IEventListenerPair";

/**
 * ElementRef
 * Elements are reused.
 */
export default class ElementRef<E extends keyof HTMLElementTagNameMap> {
  /**
   * Creating a new native element from pool or direct creation
   * @param {E} type
   */
  public static new<E extends keyof HTMLElementTagNameMap>(
    type: E
  ): ElementRef<E> {
    const elementRef = this.__fromPool(type);
    if (elementRef) {
      return elementRef;
    }

    return new ElementRef(type);
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
  protected static __fromPool<E extends keyof HTMLElementTagNameMap>(
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
  protected static __toPool<E extends keyof HTMLElementTagNameMap>(
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

  protected _element: HTMLElementTagNameMap[E] | undefined;
  public get element(): HTMLElementTagNameMap[E] | undefined { return this._element; }

  protected _listenerTypesMap = new Map<
    string,
    EventListenerOrEventListenerObject[]
  >();

  protected _listeners = new Array<IEventListenerPair>();

  /**
   * @param {E} type
   */
  protected constructor(public readonly type: E) {
    this._createNativeElement();
  }

  /**
   * Add listeners
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions | undefined} options
   */
  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    if (!this._element) {
      throw new Error(Errors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    this._element.addEventListener(type, listener, options);

    this._listeners.push({ type, listener });

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
      throw new Error(Errors.NATIVE_ELEMENT_IS_NOT_DEFINED);
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
      throw new Error(Errors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    while (this._listeners.length) {
      const item = this._listeners.shift();

      if (!item) {
        continue;
      }

      this._element.removeEventListener(item.type, item.listener);
    }

    // clear map
    this._listenerTypesMap.clear();
  }

  public dispose(options?: IElementRefDisposeOptions): void {
    if (!this._element) {
      throw new Error(Errors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    ElementRef.__toPool(this.type, this);

    this.removeAllListeners();

    if (!options) {
      return;
    }

    if (options.clearClasses) {
      // this._element.classList.remove(...this._element.classList);
    }

    if (options.clearInlineStyles) {
      this._element.removeAttribute("style");
    }
  }

  protected _createNativeElement(): void {
    this._element = document.createElement<E>(this.type);
  }
}
