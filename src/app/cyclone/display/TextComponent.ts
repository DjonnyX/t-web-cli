import { cyclone } from "../core";
import { TextElementRef, BaseComponent, computeContentText } from "./base";

const TEXT_ELREF_TYPE = "__text-node__"; // necessary to determine

/**
 * Basic component
 */
export default class TextComponent<E extends Text = any> extends BaseComponent<
  E
> {
  public get data(): string {
    return (this.nativeElement.element as Text).data;
  }

  public set data(v: string) {
    (this.nativeElement.element as Text).data = v;
  }

  protected _propsForBinding: {
    [propName: string]: () => any;
  } = {};

  protected _innerTextSegments: {
    [propName: string]: Function;
  } = {};
  protected _innerTextSegmentsOrder = new Array<string>();

  constructor() {
    super();

    const elementRefType = TEXT_ELREF_TYPE;

    this.nativeElement = TextElementRef.new({
      elementRefType
    } as any);
  }

  public markForVerify(): void {
    cyclone.addDeferCall(this._detectChanges);
  }

  protected _detectChanges = (): void => {
    this.updateContentText();
  };

  protected updateContentText(): void {
    const textContent = computeContentText(
      this._innerTextSegmentsOrder,
      this._innerTextSegments
    );
    if (textContent && textContent !== this.nativeElement.element.textContent) {
      this.nativeElement.element.textContent = textContent;
    }
  }

  /**
   * Prepares and returns a property for binding
   */
  public readonly makePropForBinding = <T = any>(
    propName: string
  ): (() => T) => {
    if (!(propName in this._propsForBinding)) {
      this._propsForBinding[propName] = (): T => {
        return (this as Record<string, any>)[propName];
      };
    }
    return this._propsForBinding[propName];
  };

  public readonly addPropertyToContentText = <T = any>(
    propName: string,
    externalProperty: () => T
  ): void => {
    if (propName in this._innerTextSegments) {
      return;
    }
    this._innerTextSegments[propName] = externalProperty;
    this._innerTextSegmentsOrder.push(propName);
  };

  public readonly addTextSegmentToContentText = (text: string): void => {
    this._innerTextSegmentsOrder.push(text);
  };

  public dispose(): void {
    // etc
  }
}
