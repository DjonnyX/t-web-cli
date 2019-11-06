import { RuntimeErrors } from "../../runtime";
import { Component } from "../../display";
import { IModule } from "../../module";
import { getCClass } from "./helpers";
import {
  CLOSURE_TAG_REGEX,
  LEAD_TAG_REGEX,
  ATTRS_REGEX,
  ATTR_VALUE_REGEX,
  ATTR_NAME_REGEX,
  TAG_NAME
} from "./helpers/regex";

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

    const mSegments = template.match(template);

    if (!mSegments) {
      throw new Error(RuntimeErrors.WRONG_TEMPLATE);
    }

    let mounter: Component<any> = owner;

    for (let i = 0, l = mSegments.length; i < l; i++) {
      const s = mSegments[i];
      if (CLOSURE_TAG_REGEX.test(s)) {
        mounter = mounter.parent;
        continue;
      }

      if (LEAD_TAG_REGEX.test(s)) {

        const mTagName = s.match(TAG_NAME);

        if (!mTagName) {
          throw new Error(RuntimeErrors.WRONG_TEMPLATE);
        }

        const CClass = getCClass(cModule, mTagName[0]) || Component;
        const component = new CClass();

        // add attrs
        const mAttributes = s.match(ATTRS_REGEX);
        if (mAttributes) {
          for (let j = 0, l1 = mAttributes.length; j < l1; j++) {
            const mAttr = mAttributes[j];

            const mAttrName = mAttr.match(ATTR_NAME_REGEX);
            if (!mAttrName) {
              throw new Error(RuntimeErrors.WRONG_TEMPLATE);
            }

            const mAttrValue = mAttr.match(ATTR_VALUE_REGEX);
            if (!mAttrValue) {
              throw new Error(RuntimeErrors.WRONG_TEMPLATE);
            }

            const attrName = mAttrName[0];
            const attrVal = mAttrValue[0];
            component.nativeElement.element.setAttribute(attrName, attrVal);
          }
        }

        mounter.addChild(component);
        mounter = component;
        continue;
      }

      mounter.innerText = s;
    }
  }
}

export default CSerializer;
