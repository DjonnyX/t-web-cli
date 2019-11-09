import { CModule } from ".";
import { Component } from "../display";

const testModule = new CModule();

class TestComponent extends Component {
  public static meta = {
    selectorName: "test-component",
    cModule: testModule
  };

  constructor() {
    super(TestComponent.meta);
  }
}

testModule.components = {
  TestComponent
};

describe("CModule", () => {
  it('must be returned TestComponent class by "test-component" selector', () => {
    expect(("test-component" in testModule.components))
      .toBeTruthy();
  });
});
