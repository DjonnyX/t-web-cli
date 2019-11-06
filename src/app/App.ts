import { Component } from "./cyclone/display";
import { cModule } from "./cyclone/module";

export default class App extends Component {
  constructor() {
    super({
      template: `<a>
      <a class="ssd">
        test
      </a>
      <a>
        test
      </a>
        </a>
      `,
      selectorName: "root",
      cModule: cModule
    });
  }
}

cModule.components = {
  App: App
};
