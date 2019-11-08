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
  SEGMENT_REGEX,
  PROCEDURE_ATTR_REGEX,
  ATTR_NAME_EVENT_REGEXP,
  PROCEDURE_TEXT_REGEX
} from "./helpers/regex";
import { cyclone } from "..";

/**
 * Serializing simple template with events, binding methods
 */
class CSerializer {
  public static parse(
    owner: Component<any>,
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
      const selectorText = mSegment.replace(TAG_REGEX, "").replace(/^\s+/m, "");

      const mSelectorText = selectorText.match(PROCEDURE_TEXT_REGEX);
      if (mSelectorText && mSelectorText.length) {
        // inner handler
      }

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

            // events
            if (ATTR_NAME_EVENT_REGEXP.test(mAttr)) {
              const attrName = mAttr
                .match(ATTR_NAME_EVENT_REGEXP)[0]
                .replace(/[\(|\)]/gm, "");
              const mAttrValue = mAttr.match(PROCEDURE_ATTR_REGEX);

              if (!(mAttrValue && mAttrValue.length)) {
                continue;
              }

              if (PROCEDURE_ATTR_REGEX.test(mAttrValue[0])) {
                const mAttrProcedureValue = mAttr.match(PROCEDURE_ATTR_REGEX);
                if (mAttrProcedureValue && mAttrProcedureValue.length > 0) {
                  // procedure | prop
                  const attrValue = mAttrProcedureValue[0].replace(/{|}/gm, "");

                  const intEvent = component.addInteractionEvent(attrName);

                  owner.bindInteractionHandler(intEvent, attrValue);
                  continue;
                }
              }
            }

            // props
            if (ATTR_NAME_REGEX.test(mAttr)) {
              const attrName = mAttr.match(ATTR_NAME_REGEX)[0];

              const mAttrValue = mAttr.match(ATTR_VALUE_REGEX);

              if (!(mAttrValue && mAttrValue.length)) {
                continue;
              }

              let attrValue = undefined;

              // props / methods
              if (PROCEDURE_ATTR_REGEX.test(mAttrValue[0])) {
                const mAttrProcedureValue = mAttr.match(PROCEDURE_ATTR_REGEX);
                if (mAttrProcedureValue && mAttrProcedureValue.length > 0) {
                  // procedure | prop
                  attrValue = mAttrProcedureValue[0].replace(/{|}/gm, "");

                  if (
                    !(component as Record<string, any>).hasOwnProperty(attrName)
                  ) {
                    // property not found
                    throw new Error(
                      RuntimeErrors.PROPERTY__S__IS_NOT_DEFINED_OF__O_.replace(
                        /\$s/,
                        attrName
                      ).replace(/\$o/, tName)
                    );
                  }

                  (component as any)[attrName] = (owner as any)[attrValue];
                  continue;
                }
              }

              // text
              if (!attrValue) {
                attrValue = mAttrValue[0].replace(/'|"/gm, "");
                component.nativeElement.element.setAttribute(
                  attrName,
                  attrValue
                );
              }
            }
          }
        }

        if (selectorText) {
          component.innerText = selectorText;
        }

        // before attach
        component.beforeAttach();

        mounter.addChild(component);

        cyclone.addDeferCall(component.afterAttach);

        mounter = component;
      }
    }
  }
}

export default CSerializer;
