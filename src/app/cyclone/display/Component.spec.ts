/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component } from ".";
import CModule from "../module/CModule";
import { mount } from "../utils/dom";

const testModule = new CModule();

class TestComponent extends Component {
  public static readonly meta = {
    template: `<div click={clickHandler}>
          <sub-component></sub-component>
        </div>`,
    selectorName: "test-component",
    cModule: testModule
  };

  public static instance: TestComponent;

  protected _reaction = 0;
  public get reaction(): number {
    return this._reaction;
  }

  constructor() {
    super(TestComponent.meta);

    TestComponent.instance = this;
  }

  clickHandler = (): void => {
    this._reaction = 0;
  };
}

class SubComponent extends Component {
  public static readonly meta = {
    template: `<span class="sub-test-class">test</span>`,
    selectorName: "sub-component",
    cModule: testModule
  };

  constructor() {
    super(SubComponent.meta);
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

  it("reaction must equal 2", () => {
    TestComponent.instance.nativeElement.element.click();
    TestComponent.instance.nativeElement.element.click();

    expect(TestComponent.instance.reaction).toEqual(2);

    TestApp.instance.dispose();
  });
});
