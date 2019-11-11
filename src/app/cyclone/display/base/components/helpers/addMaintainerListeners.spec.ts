/* eslint-disable @typescript-eslint/no-unused-vars */
import { HTMLComponent } from "../../..";
import { IComponentOptions } from "../../../interfaces";
import { CModule } from "../../../../module";
import { mount } from "../../../../utils/dom";

const testModule = new CModule();

class TestComponent extends HTMLComponent<HTMLButtonElement> {
  public static readonly meta: IComponentOptions = {
    elementRefType: "button",
    cModule: testModule,
    maintainer: {
      listeners: {
        click: "clickHandler"
      }
    }
  };

  public static instance: TestComponent;

  private _reactions = 0;
  public get reactions(): number {
    return this._reactions;
  }

  constructor() {
    super(TestComponent.meta);

    TestComponent.instance = this;
  }

  public clickHandler(e: any): void {
    this._reactions++;
  }
}

testModule.components = {
  TestComponent
};

describe("addMaintainerListeners", () => {
  it("reactions to event must be greater than 0", () => {
    const component = new TestComponent();
    mount(window.document.body, component.nativeElement.element);

    component.nativeElement.element.click();

    expect(TestComponent.instance.reactions).toBeGreaterThan(0);

    component.dispose();
  });
});
