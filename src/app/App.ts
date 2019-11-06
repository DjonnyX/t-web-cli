import CApp from "./controls/core/CApp";

export default class App extends CApp {
  constructor() {
    super();

    this.nativeElement.element.innerHTML = "Work"
  }
}
