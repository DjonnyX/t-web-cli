import { HTMLComponent, IComponentOptions } from "./cyclone/display";
import { tInputModule } from "./components";
import rootModule from "./root-module";

/**
 * @author Eugene Grebennikov (djonnyx@gmail.com)
 */
export default class App extends HTMLComponent {
  public static readonly meta: IComponentOptions = {
    template: `<div className={value}>
      Test app worked with {value}
      <div>{value}</div>
      <t-input (changeValue)={inputChange} [value]={value} [placeholder]={placeholder}></t-input>
      <button (click)={clickHandler}>My button</button>
    </div>`,
    selectorName: "root",
    cModule: rootModule
  };

  private _value = "my value";
  public set value(v: string) {
    if (this._value !== v) {
      this._value = v;

      this.markForVerify();
    }
  }
  public get value(): string {
    return this._value;
  }

  private _placeholder = "my placeholder";
  public set placeholder(v: string) {
    if (this._placeholder !== v) {
      this._placeholder = v;

      this.markForVerify();
    }
  }
  public get placeholder(): string {
    return this._placeholder;
  }

  public get r(): string {
    return "this._value";
  }

  constructor() {
    super(App.meta);
  }

  public clickHandler(): void {
    this.value = "click";
  }

  public inputChange(value: string): void {
    this.value = value;
  }
}

// export the App class to the list of modules
rootModule.components = {
  App
};
rootModule.modules = {
  tInputModule
};
