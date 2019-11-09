import { Component, IComponentOptions } from "./cyclone/display";
import { tInputModule } from "./components";
import rootModule from "./root-module";

export default class App extends Component {
  public static readonly meta: IComponentOptions = {
    template: `<div>
      Test app worked
      <t-input></t-input>
    </div>`,
    selectorName: "root",
    cModule: rootModule
  };

  constructor() {
    super(App.meta);
  }
}

// export the App class to the list of modules
rootModule.components = {
  App
};
rootModule.modules = {
  tInputModule
}
