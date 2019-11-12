import { IComponentOptions } from "./interfaces";
import HTMLComponent from "./HTMLComponent";

/**
 * Input component
 */
export default class InputComponent extends HTMLComponent<HTMLInputElement> {
  public static get count(): number {
    return this._count;
  }
  private static _count = 0;

  public static meta: IComponentOptions = {
    elementRefType: "input",
  };

  constructor(options: IComponentOptions = InputComponent.meta) {
    super(options);

    // next id
    InputComponent._count =
      InputComponent._count === Number.MAX_SAFE_INTEGER - 1
        ? 0
        : InputComponent._count + 1;
  }
}
