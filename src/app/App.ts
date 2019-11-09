import { Component, IComponentOptions } from "./cyclone/display";
import { tInputModule } from "./components";
import rootModule from "./root-module";

export default class App extends Component {
  public static readonly meta: IComponentOptions = {
    template: `<div className={value}>
      Test app worked
      <t-input (changeValue)={inputChange} [value]={value}></t-input>
      <button (click)={clickHandler}>My button</button>
    </div>`,
    selectorName: "root",
    cModule: rootModule
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
    super(App.meta);
  }

  public clickHandler(): void {
    console.log("click");
    this.value = "click";
  }

  public inputChange(value: string): void {
    console.log("input v", value);
    this.value = value;
  }
}

// export the App class to the list of modules
rootModule.components = {
  App
};
rootModule.modules = {
  tInputModule
}
