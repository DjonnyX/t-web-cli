const removeDomClasses = (element: HTMLElement): HTMLElement => {
  const classes = Array.from(element.classList.values());
  element.classList.remove(...classes);

  return element;
};
export default removeDomClasses;