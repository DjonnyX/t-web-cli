const removeDomClasses = (element: HTMLElement): HTMLElement => {
  element.classList.forEach((domClass: string) => {
    element.classList.remove(domClass);
  });

  return element;
};
export default removeDomClasses;