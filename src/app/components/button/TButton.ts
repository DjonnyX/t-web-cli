import "../../../styles/components/_button.scss";
import { IComponentOptions, HTMLComponent } from "../../cyclone/display";
import tButtonModule from "./TButton.module";
import {TRipple, tRippleModule} from "../ripple";

class TButton extends HTMLComponent {
	public static readonly meta: IComponentOptions = {
		template: `
        <button (click)={clickHandler}>
		  <span className="t-button__label">{label}</span>
          <t-ripple (__viewChild__)={rippleComponent}><t-ripple>
          <div className="t-button__overlay"></div>
        </button>
    `,
		maintainer: {
			class: "t-button"
		},
		selectorName: "t-button",
		cModule: tButtonModule
	};

	private _tRipple: TRipple;

	private _label = "";
	public set label(v: string) {
		if (this._label !== v) {
			this._label = v || "";

			this.markForVerify();
		}
	}

	public get label(): string {
		return this._label;
	}

	constructor() {
		super(TButton.meta);
	}

	/**
	 * click handler
	 * @param {MouseEvent} val
	 */
	public clickHandler(e: MouseEvent): void {
		e.preventDefault();
		this.click(e);
	}

	/**
	 * Event emitter
	 * @param {MouseEvent} e
	 */
	public click(e: MouseEvent): void {
		if (this._tRipple) {
			this._tRipple.run(e);
		}
		this.emitEvent("click", e);
	}

	public rippleComponent(child: TRipple): void {
		this._tRipple = child;
	}
}

tButtonModule.components = {
	TButton
};
tButtonModule.modules = {
	tRippleModule
};
export default TButton;
