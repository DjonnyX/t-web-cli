import CApp from "./cyclone/core/CApp";

export default class App extends CApp {
  constructor() {
    super();

    this.nativeElement.element.innerHTML = "Work"
  }
}
