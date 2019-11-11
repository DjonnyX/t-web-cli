/* eslint-disable @typescript-eslint/no-unused-vars */

import "./TInput.style.scss";
import { InputComponent, IComponentOptions } from "../../cyclone/display";
import { addClass, removeClass } from "../../cyclone/utils/dom";
import tInputModule from "./TInput.module";

class TInput extends InputComponent {
  public static readonly meta: IComponentOptions = {
    template: `
        <input id={id} (change)={inputChange} value={value} (focus)={focusHandler} (blur)={blurHandler}></input>
        <span className={lClass}>{placeholder}
          <div></div>
        </span>
        <label htmlFor={id}></label>
    `,
    maintainer: {
      class: "t-input",
      listeners: {
        click: "maintainerClickHandler"
      },
    },
    selectorName: "t-input",
    cModule: tInputModule
  };

  private _id: string;
  public get id(): string {
    return this._id;
  }

  public get lClass(): string {
    return `t-input__placeholder${this._focused ? " focus" : ""}${!Boolean(this._value) ? " empty" : " full"}`;
  }

  private _value = "";
  public set value(v: string) {
    if (this._value !== v) {
      this._value = v || "";

      this.markForVerify();
    }
  }

  public get value(): string {
    return this._value;
  }

  private _focused = false;
  public set focused(v: boolean) {
    if (this._focused !== v) {
      this._focused = v;

      this.updateClassForMaintainer();

      this.markForVerify();
    }
  }

  public get focused(): boolean {
    return this._focused;
  }

  private _placeholder = "";
  public set placeholder(v: string) {
    if (this._placeholder !== v) {
      this._placeholder = v;

      this.markForVerify();
    }
  }

  public get placeholder(): string {
    return this._placeholder;
  }

  constructor() {
    super(TInput.meta);

    this._id = `${TInput.meta.selectorName}-${InputComponent.count}`;
  }

  /**
   * Focus to input
   */
  public focus(): void {
    this.nativeElement.element.focus();
  }

  public focusHandler(e: Event): void {
    this.focused = true;
  }

  public blurHandler(e: Event): void {
    this.focused = false;
  }

  /**
   * change value handler
   */
  public inputChange(e: any): void {
    this.value = e.target.value;
    this.changeValue(e);
  }

  /**
   * Event emitter
   */
  public changeValue(e: any): void {
    this.emitEvent("changeValue", e.target.value);
  }

  /**
   * click on the maintainer
   * @param {any} e
   */
  public maintainerClickHandler(e: Event): void {
    this.focus();
  }

  protected updateClassForMaintainer(): void {
    if (this._focused) {
      addClass(this.nativeElement.element, "focus");
    } else {
      removeClass(this.nativeElement.element, "focus");
    }
  }
}

tInputModule.components = {
  TInput
};
export default TInput;
