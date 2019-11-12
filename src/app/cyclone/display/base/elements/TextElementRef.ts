  import IElementRefDisposeOptions from "../interfaces/IElementRefDisposeOptions";
  import { IElementRefOptions } from "../interfaces";
  import ElementRef from "./ElementRef";
  
  const DEFAULT_NATIVE_ELEMENT_TYPE = "div";
  
  /**
   * Text node
   */
  export default class TextElementRef<M extends Text = any> extends ElementRef<M> {
    /**
     * Creating a new native element from pool or direct creation
     * @param {E} type
     */
    public static new<M extends Text = any>(
      options?: IElementRefOptions
    ): TextElementRef<M> {
      const type = options && options.elementRefType !== undefined ? options.elementRefType : DEFAULT_NATIVE_ELEMENT_TYPE as any;
      const elementRef = this.__fromPool(type);
      if (elementRef) {
        return elementRef as TextElementRef<M>;
      }
  
      return new TextElementRef<M>(options);
    }
  
    protected static __pool = new Map<
      keyof Text,
      Array<ElementRef<Text>>
    >();
  
    /**
     * Put in the pool
     * @param {M} type
     * @param {ElementRef<M>} elementRef
     */
    protected static __fromPool<M extends Text = any, E extends keyof M = any>(
      type: E
    ): ElementRef<M> | undefined {
      const pool = this.__pool.get(type as any);
      if (pool && pool.length) {
        const el = pool.shift();
        if (el) {
          return el as unknown as ElementRef<M>;
        }
      }
  
      return undefined;
    }
  
    /**
     * Put in the pool
     * @param {M} type
     * @param {ElementRef<M>} elementRef
     */
    protected static __toPool<M extends Text = any, E extends keyof M = any>(
      type: E,
      elementRef: TextElementRef<M>
    ): void {
      const pool = TextElementRef.__pool.get(type as any);
      if (!pool) {
        TextElementRef.__pool.set(type as any, [elementRef]);
      } else {
        pool.push(elementRef);
      }
    }
  
    public readonly selectorName!: string;

    public set data(data: string) {
        this._element.data = data;
    }
    public get data(): string {
        return this._element.data;
    }
  
    /**
     * @param {E} type
     */
    constructor(options?: IElementRefOptions) {
      super(options);
  
      this.selectorName =
        options && options.selectorName !== undefined
          ? options.selectorName
          : this.type;
  
      this._createNativeElement();
    }
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public dispose(options: IElementRefDisposeOptions = {}): void {
      
      super.dispose();
    }
  
    protected _createNativeElement(): void {
      const node = document.createTextNode("");
      this._element = node as any;
    }
  }
  