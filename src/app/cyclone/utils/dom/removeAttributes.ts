const removeAttributes = (element: HTMLElement): HTMLElement => {
  const attrs = element.attributes;
  for(let i = attrs.length - 1; i >= 0; i--) {
    const attr = attrs.item(i);
    if (attr) {
      element.removeAttribute(attr.name);
    }
  }

  return element;
};
export default removeAttributes;
