import "../../../styles/components/_button.scss";
import { IComponentOptions, HTMLComponent } from "../../cyclone/display";
import tRippleModule from "./TRipple.module";

class TRipple extends HTMLComponent {
	public static readonly meta: IComponentOptions = {
		maintainer: {
			class: "t-ripple"
		},
		selectorName: "t-ripple",
		cModule: tRippleModule
	};

	constructor() {
		super(TRipple.meta);
	}

	/**
	 * run
	 * @param {MouseEvent} e
	 */
	public run(e: MouseEvent): void {
        const rippleComponent = new HTMLComponent();
        rippleComponent.nativeElement.element.styles = {
            "position": "absolute",
            "transform": `translate(${e.clientX}px, ${e.clientY}px)`
        }
        this.addChild(rippleComponent);
	}

}

tRippleModule.components = {
	TRipple
};
export default TRipple;
