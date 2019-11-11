import {
  IComponentOptions,
} from "./interfaces";
import { HTMLElementRef, NodeComponent, addMaintainerAttributes } from "./base";
import { addMaintainerListeners } from "./base/components/helpers";

/**
 * Basic html-component
 */
export default class HTMLComponent<T = any> extends NodeComponent<T> {
  public static meta: IComponentOptions;

  constructor(options: IComponentOptions = HTMLComponent.meta) {
    super();

    let elementRefType: keyof HTMLElementTagNameMap;
    let selectorName: string;
    let template: string;

    if (options) {
      elementRefType = options.elementRefType;
      selectorName = options.selectorName;
      template = options.template;
    }

    // need maping | shadow dom

    this.nativeElement = HTMLElementRef.new({
      elementRefType,
      selectorName
    }) as any;

    if (options && options.maintainer && options.maintainer.listeners) {
      addMaintainerListeners(this, options.maintainer.listeners);
    }

    if (options) {
      addMaintainerAttributes(this, options.maintainer);
    }

    if (template && options.cModule) {
      this.injectChildrenFromTemplate(template, options.cModule);
    }
  }
}
