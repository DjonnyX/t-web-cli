import { HTMLComponent, IComponentOptions } from "../../cyclone/display";
import { tInputModule } from "../../components";
import loginLayoutModule from "./Login.module";

/**
 * @author Eugene Grebennikov (djonnyx@gmail.com)
 */
export default class LoginLayout extends HTMLComponent {
  public static readonly meta: IComponentOptions = {
    template: `<div className="login-wrapper">
    <div></div>
      <h1>Sign in to Telegram</h1>
      <div>Please confirm your country and enter your phone number.</div>
      <form>
        <t-input (changeValue)={inputChange} [value]={value} [placeholder]={placeholder}></t-input>
        <t-input (changeValue)={inputChange} [value]={value} [placeholder]={placeholder}></t-input>
        <button (click)={clickHandler}>Next</button>
      </form>
    </div>`,
    selectorName: "login",
    cModule: loginLayoutModule
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

  constructor() {
    super(LoginLayout.meta);
  }

  public clickHandler(): void {
    this.value = "click";
  }

  public inputChange(value: string): void {
    this.value = value;
  }
}

// export classes to the list of modules
loginLayoutModule.components = {
  LoginLayout
};
loginLayoutModule.modules = {
  tInputModule
};
