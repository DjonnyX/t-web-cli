const removeDomClasses = (element: HTMLElement): HTMLElement => {
  const classes = new Array<string>();
  element.classList.forEach((c: string) => {
    classes.push(c);
  })
  element.classList.remove(...classes);

  return element;
};
export default removeDomClasses;
