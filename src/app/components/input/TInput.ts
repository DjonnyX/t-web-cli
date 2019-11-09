import { InputComponent, IComponentOptions } from "../../cyclone/display";
import tInputModule from "./TInput.module";

class TInput extends InputComponent {
  public static readonly meta: IComponentOptions = {
    template: `
    <input (change)={inputChange} value={value}></input>
    `,
    selectorName: "t-input",
    cModule: tInputModule
  };

  private _value: string;
  public set value(v: string) {
    if (this._value !== v) {
      this._value = v;

      this.markForVerify();
    }
  }

  public get value(): string {
    return this._value;
  }

  constructor() {
    super(TInput.meta);
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
