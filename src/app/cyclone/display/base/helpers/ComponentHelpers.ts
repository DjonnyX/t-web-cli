import { BaseComponent } from "../components";
import { IMaintainerOptions } from "../../interfaces";

export const computeContentText = (
  order: Array<string>,
  props: {
    [propName: string]: Function;
  }
): string => {
  let result = "";
  for (const segmentName of order) {
    const extProp = segmentName in props ? props[segmentName] : undefined;
    result += extProp ? extProp() : segmentName;
  }

  return result;
};

export const addMaintainerAttributes = (
  component: BaseComponent<Element>,
  maintainer: IMaintainerOptions
): void => {
  if (!maintainer) {
    return;
  }

  const el = component.nativeElement.element;

  if (maintainer.class) {
    // simple adding
    // this will override the procedural application of properties
    el.className = maintainer.class;
  }
};
