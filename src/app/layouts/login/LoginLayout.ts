import "./LoginLayout.style.scss";
import { HTMLComponent, IComponentOptions } from "../../cyclone/display";
import { tInputModule, tButtonModule } from "../../components";
import loginLayoutModule from "./LoginLayout.module";

/**
 * @author Eugene Grebennikov (djonnyx@gmail.com)
 */
export default class LoginLayout extends HTMLComponent {
  public static readonly meta: IComponentOptions = {
    template: `<div className="t-wrapper">
      <form>
      <div className="t-logo"></div>
      <div className="t-login__t-description">
        <h1 className="t-description__title">Sign in to Telegram</h1>
        <p className="t-description__text">Please confirm your country and enter your phone number.</p>
      </div>
        <t-input (input)={inputChange} [placeholder]="Phone number"></t-input>
        <t-button className="primary" (click)={clickHandler} [label]="Next"></t-button>
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

  private _phoneNumberPlaceholder = "my placeholder";
  public set phoneNumberPlaceholder(v: string) {
    if (this._phoneNumberPlaceholder !== v) {
      this._phoneNumberPlaceholder = v;

      this.markForVerify();
    }
  }
  public get phoneNumberPlaceholder(): string {
    return this._phoneNumberPlaceholder;
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
  tInputModule,
  tButtonModule
};
