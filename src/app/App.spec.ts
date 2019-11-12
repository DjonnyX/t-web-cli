import App from "./App";
import { mount } from "./cyclone/utils/dom";

describe("App", () => {
  const app = new App();
  mount(document.body, app.nativeElement.element);

  it("must be montained", () => {
    expect(document.getElementsByTagName("root").length).toEqual(1);
  });
});
