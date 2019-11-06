import ElementRef from "./base/ElementRef";
import { IComponentOptions } from "./interfaces";
import CSerializer from "../core/serializer/CSerializer";
import { IModule } from "../module";

/**
 * Component
 */
export default class Component<E extends keyof HTMLElementTagNameMap = "div"> {
  public static meta: {
    template?: string;
    elementRefType?: keyof HTMLElementTagNameMap;
    selectorName?: string;
    module?: IModule;
  } = {};

  public readonly nativeElement: ElementRef<E>;

  protected _children = new Array<Component<any>>();

  protected _parent!: Component<any>;
  public get parent(): Component<any> {
    return this._parent;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public constructor(options: IComponentOptions = {}) {
    const { selectorName, elementRefType, template } = options;

    this.nativeElement = ElementRef.new({
      elementRefType,
      selectorName
    });

    if (template && options.cModule) {
      this.injectChildrenFromTemplate(template, options.cModule);
    }
  }

  public addChild<E extends keyof HTMLElementTagNameMap = "div">(
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

  public set innerText(value: string) {
    this.nativeElement.element.innerText = value;
  }

  protected injectChildrenFromTemplate(template: string, m: IModule): void {
    new CSerializer(this, template, m);
  }
}
