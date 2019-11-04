import { Errors } from "../../runtime";
import IEventListenerPair from "./interfaces/IEventListenerPair";
import IElementRefDisposeOptions from "./interfaces/IElementRefDisposeOptions";

/**
 * ElementRef
 * Elements are reused.
 */
export default class ElementRef<E extends keyof HTMLElementTagNameMap> {
  /**
   * Creating a new native element from pool or direct creation
   * @param {E} type
   */
  public static new<E extends keyof HTMLElementTagNameMap>(type: E) {
    const elementRef = this.__fromPool(type);
    if (elementRef) return elementRef;

    return new ElementRef(type);
  }

  private static _typedPool = new Map<
    keyof HTMLElementTagNameMap,
    Array<ElementRef<keyof HTMLElementTagNameMap>>
  >();

  /**
   * Put in the pool
   * @param {E} type
   * @param {ElementRef<E>} elementRef
   */
  private static __fromPool<E extends keyof HTMLElementTagNameMap>(type: E) {
    const pool = this._typedPool.get(type);
    if (pool && pool.length) {
      const el = pool.shift();
      if (el) {
        return el;
      }
    }

    return undefined;
  }

  /**
   * Put in the pool
   * @param {E} type
   * @param {ElementRef<E>} elementRef
   */
  private static __toPool<E extends keyof HTMLElementTagNameMap>(
    type: E,
    elementRef: ElementRef<E>
  ) {
    const pool = ElementRef._typedPool.get(type);
    if (!pool) {
      ElementRef._typedPool.set(type, [elementRef]);
    } else {
      pool.push(elementRef);
    }
  }

  private _listenerTypesMap = new Map<
    string,
    EventListenerOrEventListenerObject[]
  >();

  private _listeners = new Array<IEventListenerPair>();

  private _element: HTMLElementTagNameMap[E] | undefined;

  /**
   * @param {E} type
   */
  private constructor(public readonly type: E) {
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
  ) {
    if (!this._element) {
      throw new Error(Errors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    this._element.addEventListener(type, listener, options);

    this._listeners.push({ type, listener });

    if (!this._listenerTypesMap.has(type)) {
      this._listenerTypesMap.set(type, []);
    }

    const pool = this._listenerTypesMap.get(type);
    if (pool && pool.indexOf(listener) === -1) pool.push(listener);
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
  ) {
    if (!this._element) throw new Error(Errors.NATIVE_ELEMENT_IS_NOT_DEFINED);

    this._element.removeEventListener(type, listener);

    const pool = this._listenerTypesMap.get(type);
    if (!pool) return;

    const index = pool.indexOf(listener);
    if (index === -1) return;

    pool.splice(index, 1);
  }

  /**
   * Remove all event listeners
   */
  public removeAllListeners() {
    if (!this._element) throw new Error(Errors.NATIVE_ELEMENT_IS_NOT_DEFINED);

    while (this._listeners.length) {
      const item = this._listeners.shift();

      if (!item) continue;

      this._element.removeEventListener(item.type, item.listener);
    }

    // clear map
    this._listenerTypesMap.clear();
  }

  public dispose(options?: IElementRefDisposeOptions) {
    if (!this._element) throw new Error(Errors.NATIVE_ELEMENT_IS_NOT_DEFINED);

    ElementRef.__toPool(this.type, this);

    this.removeAllListeners();

    if (!options) return;

    if (options.clearClasses)
      this._element.classList.remove(...this._element.classList);

    if (options.clearInlineStyles) this._element.removeAttribute("style");
  }

  private _createNativeElement() {
    this._element = document.createElement<E>(this.type);
  }
}
