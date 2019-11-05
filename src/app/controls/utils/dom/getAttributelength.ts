const getAttributeLength = (element: HTMLElement): number => {
  let length = 0;
  const attrs = element.attributes;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const attr of attrs) {
    length++;
  }

  return length;
};
export default getAttributeLength;
