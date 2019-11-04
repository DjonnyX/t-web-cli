import { Component } from "./controls";

export default class App extends Component<"div"> {
  constructor() {
    super();

    if (this.nativeElement.element) {
      document.body.appendChild(this.nativeElement.element);
    }
  }
}
