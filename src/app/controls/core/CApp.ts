import { Component } from "../display";
import { mount } from "../utils/dom";

export default class CApp extends Component<"div"> {
  constructor() {
    super({
        selectorName: "root"
    });

    mount(window.document.body, this.nativeElement.element);
  }
}
