import { Component } from "./cyclone/display";
import appModule from "./App.module";

export default class App extends Component {
  public static readonly meta = {
    template: `<div>
      Test app worked
    </div>`,
    selectorName: "root",
    cModule: appModule
  };

  constructor() {
    super(App.meta);
  }
}

// export the App class to the list of modules
appModule.components = {
  App
};
