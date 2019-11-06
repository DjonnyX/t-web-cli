const mount = (
  parentNode: HTMLElement | undefined,
  childNode: HTMLElement | undefined
): void => {
  if (!parentNode) {
    throw new Error(`"parentNode" is not defined.`);
  }

  if (!childNode) {
    throw new Error(`"childNode" is not defined.`);
  }

  parentNode.appendChild(childNode);
};
export default mount;
