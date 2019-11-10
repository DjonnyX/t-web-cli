import {
  IComponentOptions,
} from "./interfaces";
import HTMLComponent from "./HtmlComponent";

/**
 * Input component
 */
export default class InputComponent extends HTMLComponent<HTMLInputElement> {
  public static meta: IComponentOptions = {
      elementRefType: "input",
  };

  constructor(options: IComponentOptions = InputComponent.meta) {
    super(options);
  }
}
