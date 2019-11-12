import { HTMLComponent } from "../../display";
import CModule from "../../module/CModule";
import { mount } from "../../utils/dom";

const testModule = new CModule();

class TestLiComponent extends HTMLComponent<"ul"> {
  public static meta = {
    template: `<div>test component</div>`,
    selectorName: "test-list-component",
    cModule: testModule
  };

  constructor() {
    super(TestLiComponent.meta);
  }
}

class TestApp extends HTMLComponent {
  public static meta = {
    template: `<segment>
      <span class="test-class">
          test text
      </span>
      <test-list-component></test-list-component>
    </segment>`,
    selectorName: "root",
    cModule: testModule
  };

  constructor() {
    super(TestApp.meta);
  }
}

testModule.components = {
  TestApp,
  TestLiComponent
};

describe("serializer.CSerializer:parse", () => {
  const testApp = new TestApp();
  mount(window.document.body, testApp.nativeElement.element);

  const testedDom = testApp.nativeElement.element;

  it('must be contains "<test-list-component>"', () => {
    expect(
      testedDom.getElementsByTagName("test-list-component").length > 0
    ).toBeTruthy();
  });
});
