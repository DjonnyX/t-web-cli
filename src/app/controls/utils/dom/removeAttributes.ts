const removeAttributes = (element: HTMLElement): HTMLElement => {
  const attrs = element.attributes;
  const attrNames = [];
  for (const attr of attrs) {
    attrNames.push(attr.name);
  }
  while (attrNames.length) {
    const attrName = attrNames.pop();

    if (attrName) {
      element.removeAttribute(attrName);
    }
  }

  return element;
};
export default removeAttributes;
