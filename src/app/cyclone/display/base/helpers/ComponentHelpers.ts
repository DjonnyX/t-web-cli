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
