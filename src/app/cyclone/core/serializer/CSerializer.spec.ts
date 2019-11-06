import { Component } from "../../display";
import CModule from "../../module/CModule";
import { mount } from "../../utils/dom";

const testModule = new CModule();

class TestLiComponent extends Component<"ul"> {
  constructor() {
    super({
      template: `<div>test component</div>`,
      selectorName: "test-list-component",
      cModule: testModule
    });
  }
}

class TestApp extends Component {
  constructor() {
    super({
      template: `<segment>
        <span class="test-class">
            test text
        </span>
        <TestLiComponent/>
      </segment>`,
      selectorName: "root",
      cModule: testModule
    });
  }
}

testModule.components = {
  TestApp,
  TestLiComponent
};
const testApp = new TestApp();
mount(window.document.body, testApp.nativeElement.element);

describe("serializer.CSerializer:parse", () => {
  const testedDom = testApp.nativeElement.element;

  it('must be contains "<test-list-component>"', () => {
    expect(testedDom.getElementsByTagName("test-list-component").length > 0)
      .toBeTruthy;
  });

  // etc ..
});
