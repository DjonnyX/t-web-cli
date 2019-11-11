import { Subscription } from "rxjs";
import {
  IComponentOptions,
  IComponentDisposeOptions,
} from "./interfaces";
import { HTMLElementRef, NodeComponent, addMaintainerAttributes } from "./base";
import { addMaintainerListeners } from "./base/components/helpers";

/**
 * Basic html-component
 */
export default class HTMLComponent<T = any> extends NodeComponent<T> {
  public static meta: IComponentOptions;

  protected _interactionSubscriptions = Array<Subscription>();

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

    if (options && options.listeners) {
      addMaintainerListeners(this, options.listeners);
    }

    if (options) {
      addMaintainerAttributes(this, options.maintainer);
    }

    if (template && options.cModule) {
      this.injectChildrenFromTemplate(template, options.cModule);
    }
  }

  public dispose(
    options: IComponentDisposeOptions = { disposeChildren: true }
  ): void {
    this.removeChildren({ dispose: options.disposeChildren });
    this.removeInteractionHandlers();
    this.removeInteractionEvents();
  }
}
