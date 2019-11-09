import { InputComponent, IComponentOptions } from "../../cyclone/display";
import tInputModule from "./TInput.module";

class TInput extends InputComponent {
  public static readonly meta: IComponentOptions = {
    template: `<input (change)={inputChange} value={}></input>`,
    selectorName: "t-input",
    cModule: tInputModule
  };

  constructor() {
    super(TInput.meta);
  }

  public inputChange(e: any): void {
    console.trace(e.target.value);
  }
}

tInputModule.components = {
    TInput
}
export default TInput;
