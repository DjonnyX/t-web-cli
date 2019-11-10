import { cyclone } from "../../../core";
import { IElementRef } from "../interfaces";

export interface IBaseElementRef<C = any> {
  node: C;
}

/**
 * Basic component
 */
export default abstract class BaseComponent<E = any> {
  public nativeElement: IElementRef<E> = undefined;

  protected _parent!: BaseComponent<any>;
  public get parent(): BaseComponent<any> {
    return this._parent;
  }

  protected _propsForBinding: {
    [propName: string]: () => any;
  } = {};

  public markForVerify(): void {
    cyclone.addDeferCall(this._detectChanges);
  }

  protected _detectChanges = (): void => {
    // etc
  };

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

  /**
   * called before attaching to the owner
   */
  public beforeAttach(): void {
    // etс
  }

  /**
   * called after attaching to the owner
   */
  public afterAttach = (): void => {
    this.markForVerify();
  };

  public dispose(): void {
    // etc
    this.nativeElement = null;
  }
}
