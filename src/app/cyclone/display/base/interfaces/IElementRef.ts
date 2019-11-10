interface IElementRef<T = any> {
  element: T;
  addListener: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void;
  removeListener: (
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => void;
  removeAllListeners: () => void;
  dispose: () => void;
}

export default IElementRef;
