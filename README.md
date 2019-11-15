# t-web-cli

### features:
- Fully developed from scratch UI Framework
- Objects optimization
- event system
- html templates serializer
- system of modules
- Theme support
- change detection strategy (on push)
- typescript
- great test coverage

### examples:

Simple component

```ts
import "../../../styles/components/_button.scss";
import { IComponentOptions, HTMLComponent } from "../../cyclone/display";
import tButtonModule from "./TButton.module";
import {TRipple, tRippleModule} from "../ripple";

class TButton extends HTMLComponent {
	public static readonly meta: IComponentOptions = {
		template: `
        <button (click)={clickHandler}>
		  <span className="t-button__label">{label}</span>
          <t-ripple (__viewChild__)={rippleComponent}><t-ripple>
          <div className="t-button__overlay"></div>
        </button>
    `,
		maintainer: {
			class: "t-button"
		},
		selectorName: "t-button",
		cModule: tButtonModule
	};

	private _tRipple: TRipple;

	private _label = "";
	public set label(v: string) {
		if (this._label !== v) {
			this._label = v || "";

			this.markForVerify();
		}
	}

	public get label(): string {
		return this._label;
	}

	constructor() {
		super(TButton.meta);
	}

	public clickHandler(e: MouseEvent): void {
		e.preventDefault();
		this.click(e);
	}

	public click(e: MouseEvent): void {
		if (this._tRipple) {
			this._tRipple.run(e);
		}
		this.emitEvent("click", e);
	}

	public rippleComponent(child: TRipple): void {
		this._tRipple = child;
	}
}

tButtonModule.components = {
	TButton
};
tButtonModule.modules = {
	tRippleModule
};
export default TButton;

```

__Styling__
_styles.scss_
```scss
$light-blue-color-text-light: #ffffff;
$light-blue-color-text-dark: #000000;
$light-blue-color-red: #e53935;
$light-blue-color-blue: #4ea4f6;
$light-blue-color-white: #ffffff;

// light-blue theme
$theme-light-blue: make-theme($light-blue-color-white, $light-blue-color-blue, $light-blue-color-red, $light-blue-color-text-dark, $light-blue-color-text-light);

$themes: (
	light-blue: $theme-light-blue
);
```

_component.scss_
```scss
t-button {
	@include themify($themes) {
		background: themed(f-1);

		a {
		    color: themed(t-1);
		}
	}
}

```