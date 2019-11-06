import ElementRef from "./base/ElementRef";
import { IComponentOptions } from "./interfaces";

/**
 * Component
 */
export default class Component<E extends keyof HTMLElementTagNameMap = any> {
  public readonly nativeElement: ElementRef<E>;

  protected _children = new Array<Component<any>>();

  protected _parent!: Component<any>;
  public get parent(): Component<any> {
    return this._parent;
  }

  public constructor(options?: IComponentOptions) {
    this.nativeElement = ElementRef.new(options);
  }

  public addChild<E extends keyof HTMLElementTagNameMap = any>(
    child: Component<E>
  ): Component<E> {
    child._parent = this;
    // etc
    return child;
  }

  public removeChild<E extends keyof HTMLElementTagNameMap = any>(
    child: Component<E>
  ): Component<E> {
    // etc
    return child;
  }

  public contains<E extends keyof HTMLElementTagNameMap = any>(
    child: Component<E>
  ): boolean {
    return this._children.indexOf(child) > -1;
  }
}
