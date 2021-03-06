import { HTMLComponent, IComponentOptions } from "./cyclone/display";
import { tInputModule } from "./components";
import { LoginLayout } from "./layouts";
import rootModule from "./root-module";

/**
 * @author Eugene Grebennikov (djonnyx@gmail.com)
 */
export default class App extends HTMLComponent {
  public static readonly meta: IComponentOptions = {
    template: `<t-login></t-login>`,
    selectorName: "root",
    maintainer: {
      class: "theme-light-blue" // theme name
    },
    cModule: rootModule
  };

  constructor() {
    super(App.meta);
  }
}

// export the App class to the list of modules
rootModule.components = {
  App,
  LoginLayout
};
rootModule.modules = {
  tInputModule
};
