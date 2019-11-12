import { HTMLComponent } from ".";
import CModule from "../module/CModule";
import { mount } from "../utils/dom";
import { Observable, timer } from "rxjs";
import { IComponentOptions } from "./interfaces";
import { NodeComponent } from "./base";

const testModule = new CModule();

const INNER_TEXT = "some text";

class TestComponent extends HTMLComponent {
  public static readonly meta: IComponentOptions = {
    template: `<sub-component class="clicker" (click)={clickHandler}>
            <div class="header">s {title} s</div>
            <div className={customClassName}>
            <div class="footer">{title}</div>
          </sub-component>`,
    elementRefType: "div",
    selectorName: "test-component",
    cModule: testModule
  };

  public static instance: TestComponent;

  protected _reaction = 0;
  public get reaction(): number {
    return this._reaction;
  }

  private _isTesting = false;

  public get customClassName(): string {
    return this._isTesting ? "tested-class" : "";
  }

  public get children(): Array<NodeComponent<any>> {
    return this._children;
  }

  private _title = INNER_TEXT;
  public get title(): string {
    return this._title;
  }

  constructor() {
    super(TestComponent.meta);

    TestComponent.instance = this;
  }

  public clickHandler(): void {
    this._reaction++;
  }

  public setTesting(): void {
    this._isTesting = true;
    this.markForVerify();
  }
}

class SubComponent extends HTMLComponent {
  public static readonly meta = {
    template: `<span class="sub-test-class">test</span>`,
    selectorName: "sub-component",
    cModule: testModule
  };

  public static instance: SubComponent;

  public get linkedEvents(): {
    [eventTypes: string]: { executor: Function; emitter: Observable<any> };
  } {
    return this._linkedEvents;
  }

  constructor() {
    super(SubComponent.meta);

    SubComponent.instance = this;
  }
}

class TestApp extends HTMLComponent {
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
    expect(SubComponent.instance.linkedEvents["click"]).toBeDefined();
  });

  it("TestComponent must contain a child", () => {
    expect(TestComponent.instance.children.length).toEqual(1);
  });

  it("contain method must br return true", () => {
    expect(TestComponent.instance.contains(SubComponent.instance)).toBeTruthy();
  });

  it(`procedurical text must be equal "${INNER_TEXT}"`, () => {
    return timer(10) // wait for apply pros
      .toPromise()
      .then(() => {
        const header = TestComponent.instance.nativeElement.element.getElementsByClassName(
          "header"
        )[0];
        return expect(header.innerHTML).toEqual(`s ${INNER_TEXT} s`);
      });
  });

  it(`procedurical text must be equal "${INNER_TEXT}"`, () => {
    return timer(10) // waiting for applying props
      .toPromise()
      .then(() => {
        const footer = TestComponent.instance.nativeElement.element.getElementsByClassName(
          "footer"
        )[0];
        return expect(footer.innerHTML).toEqual(`${INNER_TEXT}`);
      });
  });

  it("reaction must equal 2", () => {
    const clicker = TestComponent.instance.nativeElement.element.getElementsByClassName(
      "clicker"
    )[0];

    clicker.click();
    clicker.click();

    expect(TestComponent.instance.reaction).toEqual(2);
  });

  it('className should be "tested-class"', () => {
    TestComponent.instance.setTesting();

    return timer(500)
      .toPromise()
      .then(() => {
        const expectedEl = TestComponent.instance.nativeElement.element.getElementsByClassName(
          "tested-class"
        );
        return expect(expectedEl.length).toBe(1);
      });
  });

  it("After calling removeChild children length must be equal 0)", () => {
    TestComponent.instance.removeChild(TestComponent.instance.children[0], {
      dispose: false
    });
    expect(TestComponent.instance.children.length).toEqual(0);
  });

  it("contain method must be return false", () => {
    expect(
      TestComponent.instance.contains(SubComponent.instance)
    ).not.toBeTruthy();
  });
});
