
import "./LoginLayout.style.scss";
import { HTMLComponent, IComponentOptions } from "../../cyclone/display";
import { tInputModule } from "../../components";
import loginLayoutModule from "./LoginLayout.module";

/**
 * @author Eugene Grebennikov (djonnyx@gmail.com)
 */
export default class LoginLayout extends HTMLComponent {
  public static readonly meta: IComponentOptions = {
    template: `<div className="t-wrapper">
      <div className="t-login__t-description">
        <div className="t-description__logo"></div>
        <h1 className="t-description__title">Sign in to Telegram</h1>
        <div className="t-description__text">Please confirm your country and enter your phone number.</div>
      </div>
      <form>
        <t-input (changeValue)={inputChange} [placeholder]="Phone number"></t-input>
        <button (click)={clickHandler}>Next</button>
      </form>
    </div>`,
    selectorName: "t-login",
    maintainer: {
      class: "t-login"
    },
    cModule: loginLayoutModule
  };

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
