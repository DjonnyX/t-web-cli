import getAttributeLength from "./getAttributelength";
import removeAttributes from "./removeAttributes";

describe("removeAttributes", () => {
  it("Attributes length must be 0", () => {
    const element = document.createElement("div");
    for (let i = 0, l = 10; i < l; i++) {
      element.setAttribute(`attr${i}`, "test");
    }

    removeAttributes(element);

    expect(getAttributeLength(element)).toEqual(0);
  });
});
