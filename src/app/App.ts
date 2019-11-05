import { Component } from "./controls";

export default class App extends Component<"div"> {
  constructor() {
    super();

    this.nativeElement.element.innerHTML = "Work"
  }
}
