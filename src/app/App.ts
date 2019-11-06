import { Component } from "./cyclone/display";
import { cModule } from "./cyclone/module";

export default class App extends Component {
  constructor() {
    super({
      template: `<a>test</a>`,
      selectorName: "root",
      cModule: cModule
    });
  }
}

cModule.components = {
  "App": App
};
