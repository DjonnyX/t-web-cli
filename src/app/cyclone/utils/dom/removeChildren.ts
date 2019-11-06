const removeChildren = (element: HTMLElement): HTMLElement => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  return element;
};
export default removeChildren;
