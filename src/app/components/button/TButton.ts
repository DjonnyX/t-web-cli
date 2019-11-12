import "./TButton.style.scss";
import { IComponentOptions, HTMLComponent } from "../../cyclone/display";
import tButtonModule from "./TButton.module";

class TButton extends HTMLComponent {
  public static readonly meta: IComponentOptions = {
    template: `
      <button (click)={clickHandler}>
        <span className="label">{label}</span>
        <div className="overlay"></div>
      </button>
    `,
    maintainer: {
      class: "t-button"
    },
    selectorName: "t-button",
    cModule: tButtonModule
  };

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
    this.click(e);
  }

  /**
   * Event emitter
   * @param {MouseEvent} e
   */
  public click(e: MouseEvent): void {
    this.emitEvent("click", e);
  }
}

tButtonModule.components = {
  TButton
};
export default TButton;
