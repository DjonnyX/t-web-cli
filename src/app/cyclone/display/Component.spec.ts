import { Component } from ".";
import CModule from "../module/CModule";
import { mount } from "../utils/dom";
import { Observable } from "rxjs";

const testModule = new CModule();

const INNER_TEXT = "some text";

class TestComponent extends Component {
  public static readonly meta = {
    template: `
          <sub-component class="clicker" (click)={clickHandler}>
            <div class="header">{title}</div>
          </sub-component>
        `,
    selectorName: "test-component",
    cModule: testModule
  };

  public static instance: TestComponent;

  protected _reaction = 0;
  public get reaction(): number {
    return this._reaction;
  }

  public get children(): Array<Component<any>> {
    return this._children;
  }

  public readonly title = INNER_TEXT;

  constructor() {
    super(TestComponent.meta);

    TestComponent.instance = this;
  }

  public clickHandler(): void {
    this._reaction++;
  }
}

class SubComponent extends Component {
  public static readonly meta = {
    template: `<span class="sub-test-class">test</span>`,
    selectorName: "sub-component",
    cModule: testModule
  };

  public static instance: SubComponent;

  public get events(): {
    [eventTypes: string]: { executor: Function; emitter: Observable<any> };
  } {
    return this._events;
  }

  constructor() {
    super(SubComponent.meta);

    SubComponent.instance = this;
  }
}

class TestApp extends Component {
  public static readonly meta = {
    template: `<test-component></test-component>`,
    selectorName: "root",
    cModule: testModule
  };

  public static instance: TestApp;

  constructor() {
    super(TestApp.meta);

    TestApp.instance = this;
  }
}

testModule.components = {
  TestApp,
  TestComponent,
  SubComponent
};

describe("Component injection", () => {
  const testApp = new TestApp();
  mount(window.document.body, testApp.nativeElement.element);

  it("length of TestComponent should be defined", () => {
    expect(TestComponent.instance).toBeDefined();
  });

  it("the events object must contain a click event", () => {
    expect(SubComponent.instance.events["click"]).toBeDefined();
  });

  it("TestComponent must contain a child", () => {
    expect(TestComponent.instance.children.length).toEqual(1);
  });

  it("contain method must br return true", () => {
    expect(TestComponent.instance.contains(SubComponent.instance)).toBeTruthy();
  });

  /* it(`procedurical text must be equal "${INNER_TEXT}"`, () => {
    const header = TestComponent.instance.nativeElement.element.getElementsByClassName(
      "header"
    )[0];
    expect(header.innerHTML).toEqual(INNER_TEXT);
  }); */

  it("reaction must equal 2", () => {
    const clicker = TestComponent.instance.nativeElement.element.getElementsByClassName(
      "clicker"
    )[0];

    clicker.click();
    clicker.click();

    expect(TestComponent.instance.reaction).toEqual(2);

    TestApp.instance.dispose({ disposeChildren: true });
  });

  it("After calling removeChild children length must be equal 0", () => {
    TestComponent.instance.removeChild(TestComponent.instance.children[0], {
      dispose: false
    });
    expect(TestComponent.instance.children.length).toEqual(0);
  });

  it("contain method must br return false", () => {
    expect(
      TestComponent.instance.contains(SubComponent.instance)
    ).not.toBeTruthy();
  });
});
