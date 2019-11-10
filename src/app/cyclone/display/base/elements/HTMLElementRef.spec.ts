import ElementRef from "./ElementRef";
import HTMLElementRef from "./HTMLElementRef";

/**
 * For test
 */
class HTMLElementRefTest<E extends HTMLElement = any> extends HTMLElementRef<
  E
> {
  public static get pool(): Map<
    keyof HTMLElementTagNameMap,
    Array<HTMLElementRefTest<any>>
  > {
    return this.__pool as any;
  }

  public static fromPool<E extends HTMLElement = any>(
    type: string
  ): HTMLElementRefTest<E> | undefined {
    return super.__fromPool(type) as any;
  }

  public static toPool<E extends HTMLElement = any>(
    type: string,
    elementRef: HTMLElementRefTest<E>
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

  public createNativeElement(): void {
    super._createNativeElement();
  }
}

const createElements = <E extends HTMLElement = any>(
  length: number,
  elementRefType: any
): Array<HTMLElementRefTest<E>> => {
  const elements: Array<HTMLElementRefTest<E>> = [];
  for (let i = 0; i < length; i++) {
    elements.push((HTMLElementRefTest as any).new({ elementRefType }));
  }
  return elements;
};

const disposeElements = <T extends keyof HTMLElementTagNameMap, K = HTMLElementTagNameMap[T]>(
  elements: Array<ElementRef<K>>,
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
    const elRef = HTMLElementRefTest.new();

    expect(elRef).toBeDefined();

    elRef.dispose();
    HTMLElementRefTest.pool.clear();
  });

  it('selector name must be "span"', () => {
    const elRef = HTMLElementRefTest.new({ elementRefType: "span" });

    expect(elRef.element.tagName).toEqual("SPAN");

    elRef.dispose();
    HTMLElementRefTest.pool.clear();
  });
});

describe("ElementRef __toPool", () => {
  it('length of the "div" pool must be 0', () => {
    const element = HTMLElementRefTest.new();
    HTMLElementRefTest.toPool("div", element as any);
    const divPool = HTMLElementRefTest.pool.get("div");

    expect(divPool ? divPool.length : -1).toEqual(1);

    element.dispose();
    HTMLElementRefTest.pool.clear();
  });
});

describe("ElementRef instances dispose", () => {
  it('The length of the "div" pool must be 3', () => {
    const divElements = createElements(10, "div");
    disposeElements(divElements, 1);
    disposeElements(divElements, 2);
    const divPool = HTMLElementRefTest.pool.get("div");

    expect(divPool ? divPool.length : -1).toEqual(3);

    disposeElements(divElements);
    HTMLElementRefTest.pool.clear();
  });

  it('The length of the "a" pool must be 0', () => {
    const aElements = createElements(5, "a");
    disposeElements(aElements, 4);
    disposeElements(aElements, 1);
    const aPpool = HTMLElementRefTest.pool.get("a");

    expect(aPpool ? aPpool.length : -1).toEqual(5);

    disposeElements(aElements);
    HTMLElementRefTest.pool.clear();
  });
});

describe("ElementRef addListener", () => {
  it("the length of listeners must equal 3", () => {
    const elRef = new HTMLElementRefTest();

    // tslint:disable-next-line: no-empty
    const testHandler = (): void => {};

    for (let i = 0, l = 3; i < l; i++) {
      elRef.addListener("click", testHandler);
    }

    const listeners = elRef.listenerTypesMap.get("click");

    expect(listeners ? listeners.length : -1).toEqual(1);

    elRef.dispose();

    HTMLElementRefTest.pool.clear();
  });

  it("reactions of listeners must equal 1", () => {
    const elRef = new HTMLElementRefTest();

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

    HTMLElementRefTest.pool.clear();
  });
});

describe("ElementRef removeListener", () => {
  it("the length of listeners must equal 0", () => {
    const elRef = new HTMLElementRefTest();

    // tslint:disable-next-line: no-empty
    const testHandler = (): void => {};

    elRef.addListener("click", testHandler);
    elRef.removeListener("click", testHandler);

    const listeners = elRef.listenerTypesMap.get("click");

    expect(listeners ? listeners.length : -1).toEqual(0);

    elRef.dispose();

    HTMLElementRefTest.pool.clear();
  });
});

describe("ElementRef removeAllListeners", () => {
  it("the length of listeners must equal 0", () => {
    const elRef = new HTMLElementRefTest();

    // tslint:disable-next-line: no-empty
    const testHandler = (): void => {};

    for (let i = 0, l = 20; i < l; i++) {
      elRef.addListener(String(i), testHandler);
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

    HTMLElementRefTest.pool.clear();
  });
});
