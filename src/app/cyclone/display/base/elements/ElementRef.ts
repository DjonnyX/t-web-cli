import { RuntimeErrors } from "../../../runtime";
import { IElementRefOptions } from "../interfaces";

const DEFAULT_NATIVE_ELEMENT_TYPE = "div";

/**
 * ElementRef
 */
export default class ElementRef<E = any> {

  public type: string;

  protected _element!: E;
  public get element(): E {
    return this._element;
  }

  protected _listenerTypesMap = new Map<
    string,
    EventListenerOrEventListenerObject[]
  >();

  constructor(options?: IElementRefOptions) {
    this.type =
      options && options.elementRefType !== undefined
        ? options.elementRefType
        : (DEFAULT_NATIVE_ELEMENT_TYPE as any);
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

    (this._element as any).addEventListener(type, listener, options);

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

    (this._element as any).removeEventListener(type, listener);

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

          (this._element as any).removeEventListener(key, listener);
        }
      }
    );

    // clear map
    this._listenerTypesMap.clear();
  }

  public dispose(): void {
    if (!this._element) {
      throw new Error(RuntimeErrors.NATIVE_ELEMENT_IS_NOT_DEFINED);
    }

    this.removeAllListeners();
  }
}
