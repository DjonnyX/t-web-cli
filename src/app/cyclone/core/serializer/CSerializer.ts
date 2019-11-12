import { RuntimeErrors } from "../../runtime";
import {
  NodeComponent,
  HTMLComponent,
  BaseComponent,
  TextComponent
} from "../../display";
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
  PROCEDURE_TEXT_REGEX,
  ATTR_NAME_COMP_REGEXP,
  PROCEDURE_SEGMENT_REGEXP,
  NODE_TEXT_WHITESPACE,
  PLAIN_ATTR_REGEX,
  COMP_SIMPLE_PROP_REGEX,
  CLASS_REGEX
} from "./helpers/regex";
import { cyclone } from "..";
import { addClass } from "../../utils/dom";

/**
 * Serializing simple template with events, binding methods
 *
 * Selector patterns:
 * (event)={handler} - Event
 * property={value} - set value to DOM property
 * [property]={value} - set value to Component property
 *
 * Inner text patterns:
 * some text - plain text
 * some {textValue} for {ownerValue} - text with properties binding
 */
class CSerializer {
  /**
   * Parse template
   * @param {NodeComponent<any>} owner
   * @param {string} template
   * @param {IModule} cModule
   */
  public static parse(
    owner: NodeComponent<any>,
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

    let mounter: NodeComponent<Element> = owner;

    for (let i = 0, l = mSegments.length; i < l; i++) {
      const mSegment = mSegments[i];
      const mSelectorBody = mSegment.match(TAG_REGEX);

      const mSegmentNormalized = mSegment.replace(NODE_TEXT_WHITESPACE, "");
      if (!mSelectorBody) {
        if (!Boolean(mSegmentNormalized)) {
          continue;
        }

        // text content
        const component = new TextComponent();

        if (PROCEDURE_SEGMENT_REGEXP.test(mSegment)) {
          const mSelectorText = mSegment.match(PROCEDURE_TEXT_REGEX);

          for (const innerTextSegment of mSelectorText) {
            if (PROCEDURE_SEGMENT_REGEXP.test(innerTextSegment)) {
              const segmentPropName = innerTextSegment.replace(/[\{|\}]/gm, "");

              if (!(segmentPropName in owner)) {
                // property not found
                throw new Error(
                  RuntimeErrors.PROPERTY__S__IS_NOT_DEFINED_OF__O_.replace(
                    /\$s/,
                    segmentPropName
                  ).replace(/\$o/, Object.getPrototypeOf(owner).name)
                );
              }

              const prop = owner.makePropForBinding(segmentPropName);

              component.addPropertyToContentText(segmentPropName, prop);

              continue;
            }

            component.addTextSegmentToContentText(innerTextSegment);
          }
        } else if ("textContent" in mounter.nativeElement.element && mSegment) {
          component.data = mSegment;
        }
        this.attach(mounter, component);
        continue;
      }

      const selectorBody = mSelectorBody[0];

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

        const component = this.getHTMLComponent(tName, cModule);

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

            // property binding
            if (ATTR_NAME_COMP_REGEXP.test(mAttr)) {
              const attrName = mAttr
                .match(ATTR_NAME_COMP_REGEXP)[0]
                .replace(/[\[|\]]/gm, "");
              const mAttrValue = mAttr.match(PROCEDURE_ATTR_REGEX);

              if (!(mAttrValue && mAttrValue.length)) {
                this.updateComponentProperyValue(component, attrName, mAttr);
                continue;
              }

              if (
                PROCEDURE_ATTR_REGEX.test(mAttrValue[0]) &&
                !PLAIN_ATTR_REGEX.test(mAttrValue[0])
              ) {
                const mAttrProcedureValue = mAttr.match(PROCEDURE_ATTR_REGEX);
                if (mAttrProcedureValue && mAttrProcedureValue.length > 0) {
                  // procedure | prop
                  const attrValue = mAttrProcedureValue[0].replace(/{|}/gm, "");

                  if (!(attrName in (component as Record<string, any>))) {
                    // property not found
                    throw new Error(
                      RuntimeErrors.PROPERTY__S__IS_NOT_DEFINED_OF__O_.replace(
                        /\$s/,
                        attrName
                      ).replace(/\$o/, tName)
                    );
                  }

                  const prop = owner.makePropForBinding(attrValue);

                  component.linkProperty(attrName, prop);
                  continue;
                }
              }
              // static
              else if (attrName in (component as Record<string, any>)) {
                this.updateComponentProperyValue(component, attrName, mAttr);
              }
            }

            // dom properties / ref
            if (ATTR_NAME_REGEX.test(mAttr)) {
              const attrName = mAttr.match(ATTR_NAME_REGEX)[0];

              const mAttrValue =
                mAttr.match(PROCEDURE_ATTR_REGEX) ||
                mAttr.match(ATTR_VALUE_REGEX);

              if (!(mAttrValue && mAttrValue.length)) {
                continue;
              }

              let attrValue = undefined;

              // props
              if (PROCEDURE_ATTR_REGEX.test(mAttrValue[0])) {
                const mAttrProcedureValue = mAttr.match(PROCEDURE_ATTR_REGEX);
                if (mAttrProcedureValue && mAttrProcedureValue.length > 0) {
                  // procedure | prop
                  attrValue = mAttrProcedureValue[0].replace(/{|}/gm, "");

                  if (
                    !(
                      attrName in
                      (component.nativeElement.element as Record<string, any>)
                    )
                  ) {
                    // property not found
                    throw new Error(
                      RuntimeErrors.PROPERTY__S__IS_NOT_DEFINED_OF__O_.replace(
                        /\$s/,
                        attrName
                      ).replace(/\$o/, tName)
                    );
                  }

                  const prop = owner.makePropForBinding(attrValue);

                  component.linkDomProperty(attrName, prop);
                  continue;
                }
              }

              // text
              if (!attrValue) {
                attrValue = mAttrValue[0].replace(/'|"/gm, "");

                if (attrName in component.nativeElement.element) {
                  if (CLASS_REGEX.test(attrName)) {
                    addClass(component.nativeElement.element, attrValue);
                  } else {
                    component.nativeElement.element[attrName] = attrValue;
                  }
                  continue;
                }

                component.nativeElement.element.setAttribute(
                  attrName,
                  attrValue
                );
              }
            }
          }
        }

        this.attach(mounter, component);

        mounter = component as any;
      }
    }
  }

  /**
   * Get HTMLComponent from class meta property
   * @param {string} name
   * @param {IModule} cModule
   */
  protected static getHTMLComponent(
    name: string,
    cModule: IModule
  ): NodeComponent<any> {
    const CClass = getCClass(cModule, name);

    return CClass
      ? (new CClass() as any)
      : new HTMLComponent({
          elementRefType: name as any,
          cModule // transmit to children
        });
  }

  /**
   * Attach node to owner
   * @param {NodeComponent<Node>} mounter
   * @param {BaseComponent} component
   */
  protected static attach(
    mounter: NodeComponent<Node>,
    component: BaseComponent
  ): void {
    component.beforeAttach();

    mounter.addChild(component as any);

    cyclone.addDeferCall(component.afterAttach);
  }

  /**
   * Setup plain text
   * @param {BaseComponent} component
   * @param {string} name
   * @param {string} attrPair
   */
  protected static updateComponentProperyValue(
    component: BaseComponent,
    name: string,
    attrPair: string
  ): void {
    const mAttr = attrPair.match(COMP_SIMPLE_PROP_REGEX);

    if (!(mAttr && mAttr.length)) {
      return;
    }

    const value = mAttr[0].replace(/'|"/gm, "");

    if (name in (component as Record<string, any>)) {
      if (CLASS_REGEX.test(name)) {
        addClass(component.nativeElement.element, value);
      } else {
        (component as Record<string, any>)[name] = value;
      }
    }
  }
}

export default CSerializer;
