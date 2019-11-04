import { IComponentOptions } from "./interfaces";
import ElementRef from "./base/ElementRef";

const DEFAULT_NATIVE_ELEMENT_TYPE = "div";

/**
 * Component
 */
export default class Component {

    public readonly element: ElementRef<any>;
    
    public readonly elementType: keyof HTMLElementTagNameMap;

	public constructor(options?: IComponentOptions) {
        this.elementType = options && options.elementRefType ? options.elementRefType : DEFAULT_NATIVE_ELEMENT_TYPE;
		this.element = ElementRef.new(this.elementType);
	}

	public dispose() {
        
	}
}
