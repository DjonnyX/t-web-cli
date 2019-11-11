/* eslint-disable @typescript-eslint/no-unused-vars */

import "./TInput.style.scss";
import { InputComponent, IComponentOptions } from "../../cyclone/display";
import tInputModule from "./TInput.module";

class TInput extends InputComponent {
  public static readonly meta: IComponentOptions = {
    template: `
      <input id={id} (change)={inputChange} value={value} (focus)={focusHandler} (blur)={blurHandler}></input>
        <label className={lClass} htmlFor={id}>
          <span>{placeholder}</span>
        </label>
      </span>
    `,
    maintainer: {
      class: "t-input"
    },
    selectorName: "t-input",
    cModule: tInputModule
  };

  private _id: string;
  public get id(): string {
    return this._id;
  }

  public get lClass(): string {
    return `t-placeholder${this.focused ? " focus": ""}`;
  }

  private _value = "";
  public set value(v: string) {
    if (this._value !== v) {
      this._value = v;

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

  public focusHandler(e: any): void {
    this.focused = true;
  }

  public blurHandler(e: any): void {
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
    console.log(e.target.value);
  }
}

tInputModule.components = {
    TInput
}
export default TInput;
