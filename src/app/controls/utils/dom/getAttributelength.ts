const getAttributeLength = (element: HTMLElement): number => {
  const attrs = element.attributes;
  return attrs.length;
};
export default getAttributeLength;
