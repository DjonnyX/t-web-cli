import mount from "./mount";
import removeChildren from "./removeChildren";

describe("removeChildren", () => {
  it("Children must be 0", () => {
    const element = document.createElement("div");
    for (let i = 0, l = 10; i < l; i++) {
      const child = document.createElement("div");
      mount(element, child);
    }

    removeChildren(element);

    expect(element.children.length).toEqual(0);
  });
});
