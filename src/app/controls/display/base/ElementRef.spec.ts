import ElementRef from "./ElementRef";

/**
 * For test
 */
class ElementRefTest<E extends keyof HTMLElementTagNameMap> extends ElementRef<
  E
> {
  public static get pool(): Map<
    keyof HTMLElementTagNameMap,
    Array<ElementRef<keyof HTMLElementTagNameMap>>
  > {
    return this.__pool;
  }

  public static fromPool<E extends keyof HTMLElementTagNameMap>(
    type: E
  ): ElementRef<E> | undefined {
    return super.__fromPool(type);
  }

  public static toPool<E extends keyof HTMLElementTagNameMap>(
    type: E,
    elementRef: ElementRef<E>
  ): void {
    super.__toPool(type, elementRef);
  }

  public static clearPool(): void {
    this.__pool.clear();
  }

  public get listenerTypesMap(): Map<
    string,
    EventListenerOrEventListenerObject[]
  > {
    return this._listenerTypesMap;
  }

  public constructor(type: E) {
    super(type);
  }

  public createNativeElement(): void {
    super._createNativeElement();
  }
}

const createElements = <T extends keyof HTMLElementTagNameMap>(
  length: number,
  type: T
): Array<ElementRef<T>> => {
  const elements: Array<ElementRef<T>> = [];
  for (let i = 0; i < length; i++) {
    elements.push(ElementRefTest.new(type));
  }
  return elements;
};

const disposeElements = <T extends keyof HTMLElementTagNameMap>(
  elements: Array<ElementRef<T>>,
  count = -1
): void => {
  const l = elements.length;
  while (elements.length) {
    if (!(count > -1 && elements.length > l - count)) return;
    const element = elements.pop();

    if (element) {
      element.dispose();
    }
  }
};

describe("ElementRef new", () => {
  it("the instanse of ElementRef<div> should be defined", () => {
    const elRef = ElementRefTest.new("div");

    expect(elRef).toBeDefined();

    elRef.dispose();
    ElementRefTest.pool.clear();
  });

  it("the instanse of ElementRef<a> should be defined", () => {
    const elRef = ElementRefTest.new("a");

    expect(elRef).toBeDefined();

    elRef.dispose();
    ElementRefTest.pool.clear();
  });
});

describe("ElementRef __toPool", () => {
  it('The length of the "div" pool must be 0', () => {
    const element = ElementRefTest.new("div");
    ElementRefTest.toPool("div", element);
    const divPool = ElementRefTest.pool.get("div");

    expect(divPool ? divPool.length : -1).toEqual(1);

    element.dispose();
    ElementRefTest.pool.clear();
  });
});

describe("ElementRef instances dispose", () => {
  it('The length of the "div" pool must be 3', () => {
    const divElements = createElements(10, "div");
    disposeElements(divElements, 1);
    disposeElements(divElements, 2);
    const divPool = ElementRefTest.pool.get("div");

    expect(divPool ? divPool.length : -1).toEqual(3);

    disposeElements(divElements);
    ElementRefTest.pool.clear();
  });

  it('The length of the "a" pool must be 0', () => {
    const aElements = createElements(5, "a");
    disposeElements(aElements, 4);
    disposeElements(aElements, 1);
    const aPpool = ElementRefTest.pool.get("a");

    expect(aPpool ? aPpool.length : -1).toEqual(5);

    disposeElements(aElements);
    ElementRefTest.pool.clear();
  });
});

describe("ElementRef addListener", () => {
  it("the length of listeners must equal 3", () => {
    const elRef = new ElementRefTest("div");

    // tslint:disable-next-line: no-empty
    const testHandler = (): void => {};

    for (let i = 0, l = 3; i < l; i++) {
      elRef.addListener("click", testHandler);
    }

    const listeners = elRef.listenerTypesMap.get("click");

    expect(listeners ? listeners.length : -1).toEqual(1);

    elRef.dispose();

    ElementRefTest.pool.clear();
  });

  it("reactions of listeners must equal 1", () => {
    const elRef = new ElementRefTest("div");

    let reactions = 0;

    const testHandler = (): void => {
      reactions++;
    };

    for (let i = 0, l = 5; i < l; i++) {
      elRef.addListener("click", testHandler);
    }

    // dispatch click event
    if (elRef.element) {
      elRef.element.click();
    }

    expect(reactions).toEqual(1);

    elRef.dispose();

    ElementRefTest.pool.clear();
  });
});

describe("ElementRef removeListener", () => {
  it("the length of listeners must equal 0", () => {
    const elRef = new ElementRefTest("div");

    // tslint:disable-next-line: no-empty
    const testHandler = (): void => {};

    elRef.addListener("click", testHandler);
    elRef.removeListener("click", testHandler);

    const listeners = elRef.listenerTypesMap.get("click");

    expect(listeners ? listeners.length : -1).toEqual(0);

    elRef.dispose();

    ElementRefTest.pool.clear();
  });
});

describe("ElementRef removeAllListeners", () => {
  it("the length of listeners must equal 0", () => {
    const elRef = new ElementRefTest("div");

    // tslint:disable-next-line: no-empty
    const testHandler = (): void => {};

    for (let i = 0, l = 20; i < l; i++) {
      elRef.addListener(
        String.fromCharCode(Math.ceil(Math.random() * 100)),
        testHandler
      );
    }

    elRef.removeAllListeners();

    let count = 0;
    elRef.listenerTypesMap.forEach(
      (listeners: EventListenerOrEventListenerObject[]) => {
        count += listeners.length;
      }
    );

    expect(count).toEqual(0);

    elRef.dispose();

    ElementRefTest.pool.clear();
  });
});
