import {
  IComponentOptions,
} from "./interfaces";
import { Component } from ".";

/**
 * Input component
 */
export default class InputComponent extends Component<"input"> {
  public static meta: IComponentOptions = {
      elementRefType: "input",
  };

  constructor(options: IComponentOptions = InputComponent.meta) {
    super(options);
  }
}
