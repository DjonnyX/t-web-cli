import getAttributeLength from "./getAttributeLength";

describe("getAttributeLength", () => {
  it("Attributes length must be 10", () => {
    const element = document.createElement("div");
    for (let i = 0, l = 10; i < l; i++) {
      element.setAttribute(`attr${i}`, "test");
    }
    expect(getAttributeLength(element)).toEqual(10);
  });
});
