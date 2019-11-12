import { HTMLComponent } from "../../../display";
import CModule from "../../../module/CModule";
import getCClass from "./getCClass";

const testModule = new CModule();

class TestComponent extends HTMLComponent {
  public static readonly meta = {
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

describe("serializer.helper.getCClass", () => {
  it("must be return TestComponent", () => {
    expect(getCClass(testModule, "test-component")).toEqual(TestComponent);
  });
});
