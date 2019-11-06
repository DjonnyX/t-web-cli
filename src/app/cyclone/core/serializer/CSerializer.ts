import { RuntimeErrors } from "../../runtime";
import { Component } from "../../display";
import { IModule } from "../../module";
import { getCClass } from "./helpers";
import { CLOSURE_TAG_REGEX, LEAD_TAG_REGEX } from "./helpers/regex";

class CSerializer<E extends keyof HTMLElementTagNameMap = any> {
  constructor(owner: Component<E>, template: string, cModule: IModule) {
    this.parse(owner, template, cModule);
  }

  protected parse(
    owner: Component<E>,
    template: string,
    cModule: IModule
  ): void {
    if (!template) {
      return;
    }

    const segments = template.match(template);

    if (!segments) {
      throw new Error(RuntimeErrors.WRONG_TEMPLATE);
    }

    let mounter = owner;

    for (let i = 0, l = segments.length; i < l; i++) {
      const s = segments[i];
      if (CLOSURE_TAG_REGEX.test(s)) {
        mounter = mounter.parent;
        continue;
      }

      if (LEAD_TAG_REGEX.test(s)) {
        const CClass = getCClass(cModule, s);

        const component = new CClass();

        mounter.addChild(component);
        mounter = component;
        continue;
      }

      mounter.innerText = s;
    }
  }
}

export default CSerializer;
