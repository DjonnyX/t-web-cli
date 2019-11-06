import { Component } from "../../../display";
import CModule from "../../../module/CModule";
import getCClass from "./getCClass";

const testModule = new CModule();

class TestComponent extends Component {}

testModule.components = {
  TestComponent
};

describe("serializer.helper.getCClass", () => {
  it("must be return TestComponent", () => {
    expect(getCClass(testModule, "TestComponent")).toBeTruthy;
  });
});
