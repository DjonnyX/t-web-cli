import ElementRef from "./base/ElementRef";
import { IComponentOptions } from "./interfaces";

const DEFAULT_NATIVE_ELEMENT_TYPE = "div";

/**
 * Component
 */
export default class Component<E extends keyof HTMLElementTagNameMap>  {
  public readonly nativeElement: ElementRef<E>;

  public readonly elementType: E = DEFAULT_NATIVE_ELEMENT_TYPE as any;

  public constructor(options?: IComponentOptions) {

	if (options && options.elementRefType) {
		this.elementType = options.elementRefType as any;
	}
    

	this.nativeElement = ElementRef.new(this.elementType);
  }
}
