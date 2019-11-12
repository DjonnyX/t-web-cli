/* eslint-disable @typescript-eslint/no-unused-vars */

import "./TInput.style.scss";
import { InputComponent, IComponentOptions, HTMLComponent } from "../../cyclone/display";
import { addClass, removeClass } from "../../cyclone/utils/dom";
import tInputModule from "./TInput.module";

class TInput extends InputComponent {
  public static readonly meta: IComponentOptions = {
    template: `
      <label htmlFor={id}>
        <input (viewChild)={setInputComponent} id={id} (input)={inputInputHandler} (select)="selectHandler" (change)={inputChangeHandler}
          value={value} (focus)={focusHandler} (blur)={blurHandler} (keydown)="{keydownHandler} (pointerdown)="{pointerDownHandler}"></input>
          <div (viewChild)={setCaretComponent} className="t-input__caret"></div>
          <span className={lClass}>{placeholder}</span>
      </label>
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
    return `t-input__placeholder${this._focused ? " focus" : ""}${!Boolean(this._value) ? " empty" : " full"}`;
  }

  private _inputComponent: InputComponent;

  public get inputComponent(): InputComponent {
    return this._inputComponent;
  }

  private _caretComponent: HTMLComponent;

  public get caretComponent(): HTMLComponent {
    return this._caretComponent;
  }

  private _value = "";
  public set value(v: string) {
    if (this._value !== v) {
      this._value = v || "";
  
      this.updateCaretPos();
  
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

  /**
   * @param {Event} e
   */
  public focusHandler(e: Event): void {
    this.focused = true;
  }

  /**
   * @param {Event} e
   */
  public blurHandler(e: Event): void {
    this.focused = false;
  }

  /**
   * change value handler
   * @param {InputEvent} val
   */
  public inputChangeHandler(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
  
    this.updateValue(target.value, target.selectionEnd);

    this.input(target.value);
    this.change(target.value);
  }

  /**
   * change value handler
   * @param {InputEvent} e
   */
  public inputInputHandler(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
  
    this.updateValue(target.value, target.selectionEnd);
  
    this.input(target.value);
  }

  /**
   * @param {InputEvent} e
   */
  public selectHandler(e: InputEvent): void {
    const target = e.target as HTMLInputElement;

    this.updateCaretPos();

    this.markForVerify();
  }

  protected updateValue(val: string, selectionIndex: number): void {
    this._value = val;

    this.updateCaretPos();

    this.markForVerify();
  }

  /**
   * Event emitter
   * @param {Event} e
   */
  public change(val: string): void {
    this.emitEvent("change", val);
  }

  /**
   * Event emitter
   * @param {InputEvent} e
   */
  public input(val: string): void {
    this.emitEvent("input", val);
  }

  protected updateCaretPos(): void {
    // this._selectionValue = val.slice(0, index);

    // this._caretComponent.nativeElement.element.left = 
    // this.calcCaretPos();
  }

  protected calcCaretPos(): number {
    const inputRef = this._inputComponent.nativeElement.element;

    if (!inputRef) {
      return 0;
    }

    const result = 0;


    return result;
  }

  /**
   * change value handler
   */
  public keydownHandler(e: KeyboardEvent): void {
    this.updateCaretPos();
  }

  /**
   * change value handler
   */
  public pointerdown(e: PointerEvent): void {
    const target = e.target as HTMLInputElement;

    this._inputComponent.nativeElement.addListener("pointermove", this._pointerMove);
    this._inputComponent.nativeElement.addListener("pointerup", this._pointerUp);
  
    this.updateCaretPos();
  }

  private _pointerMove(e: PointerEvent): void {

    this.updateCaretPos();
  }

  private _pointerUp(e: PointerEvent): void {

    this.updateCaretPos();

    this._inputComponent.nativeElement.addListener("pointermove", this._pointerMove);
    this._inputComponent.nativeElement.addListener("pointerup", this._pointerUp);
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

  public setCaretComponent(v: HTMLComponent): void {
    if (this._caretComponent !== v) {
      this._caretComponent = v;


      this.markForVerify();
    }
  }
  public setInputComponent(v: InputComponent): void {
    if (this._inputComponent !== v) {
      this._inputComponent = v;


      this.markForVerify();
    }
  }
}

tInputModule.components = {
  TInput
};
export default TInput;
