import {
  removeAttributes,
  removeChildren,
  removeDomClasses
} from "../../../utils/dom";
import IElementRefDisposeOptions from "../interfaces/IElementRefDisposeOptions";
import { IElementRefOptions } from "../interfaces";
import ElementRef from "./ElementRef";

const DEFAULT_NATIVE_ELEMENT_TYPE = "div";

/**
 * ElementRef
 */
export default class HTMLElementRef<E extends HTMLElement = any> extends ElementRef<E> {
  /**
   * Creating a new native element from pool or direct creation
   * @param {E} type
   */
  public static new<E extends HTMLElement = any>(
    options?: IElementRefOptions
  ): HTMLElementRef<E> {
    const type = options && options.elementRefType !== undefined ? options.elementRefType : DEFAULT_NATIVE_ELEMENT_TYPE as any;
    const elementRef = this.__fromPool(type);
    if (elementRef) {
      return elementRef;
    }

    return new HTMLElementRef(options);
  }

  protected static __pool = new Map<
    keyof HTMLElementTagNameMap,
    Array<HTMLElementRef>
  >();

  /**
   * Put in the pool
   * @param {string} type
   * @param {HTMLElementRef<E>} elementRef
   */
  protected static __fromPool<E extends HTMLElement = any>(
    type: string
  ): HTMLElementRef<E> | undefined {
    const pool = this.__pool.get(type as any);
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
   * @param {string} type
   * @param {HTMLElementRef<E>} elementRef
   */
  protected static __toPool<E extends HTMLElement = any>(
    type: string,
    elementRef: HTMLElementRef<E>
  ): void {
    const pool = HTMLElementRef.__pool.get(type as any);
    if (!pool) {
      HTMLElementRef.__pool.set(type as any, [elementRef]);
    } else {
      pool.push(elementRef);
    }
  }

  public readonly selectorName!: string;

  protected _listenerTypesMap = new Map<
    string,
    EventListenerOrEventListenerObject[]
  >();

  constructor(options?: IElementRefOptions) {
    super(options);

    this.selectorName =
      options && options.selectorName !== undefined
        ? options.selectorName
        : this.type;

    this._createNativeElement();
  }

  public dispose(options: IElementRefDisposeOptions = {
    clearClasses: true,
    clearAttribute: true,
    clearInnerHtml: true
  }): void {
    
    super.dispose();

    if (options.clearClasses) {
      removeDomClasses(this._element as any);
    }

    if (options.clearAttribute) {
      removeAttributes(this._element as any);
    }

    if (options.clearInnerHtml) {
      removeChildren(this._element as any);
    }

    if (!options.clearAttribute && options.clearInlineStyles) {
      this._element.removeAttribute("style");
    }
  }

  protected _createNativeElement(): void {
    this._element = document.createElement(this.selectorName as any, {is: this.type});
  }
}
