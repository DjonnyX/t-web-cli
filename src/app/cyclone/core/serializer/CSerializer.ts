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
  TAG_NAME,
  TAG_REGEX,
  SEGMENT_REGEX
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

    const mSegments = template.match(SEGMENT_REGEX);

    if (!mSegments) {
      return;
    }

    let mounter: Component<any> = owner;

    for (let i = 0, l = mSegments.length; i < l; i++) {
      const mSegment = mSegments[i];
      const mSelectorBody = mSegment.match(TAG_REGEX);

      if (!mSelectorBody) {
        continue;
      }

      const selectorBody = mSelectorBody[0];
      const selectorText = mSegment.replace(TAG_REGEX, '').replace(/^\s+/m, '');

      if (CLOSURE_TAG_REGEX.test(selectorBody) && mounter.parent) {
        mounter = mounter.parent;
        continue;
      }

      if (LEAD_TAG_REGEX.test(selectorBody)) {

        const mTagName = selectorBody.match(TAG_NAME);

        if (!mTagName) {
          throw new Error(RuntimeErrors.WRONG_TEMPLATE);
        }

        const tName = mTagName[0];
        const CClass = getCClass(cModule, tName);
        let component: Component<any>;
        if (!CClass) {
          component = new Component({
            elementRefType: tName as any,
            cModule // transmit to children
          });
        } else {
          component = new CClass();
        }

        // add attrs
        const mAttributes = selectorBody.match(ATTRS_REGEX);
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

        if (selectorText) {
          component.innerText = selectorText;
        }

        mounter.addChild(component);
        mounter = component;
      }
    }
  }
}

export default CSerializer;
