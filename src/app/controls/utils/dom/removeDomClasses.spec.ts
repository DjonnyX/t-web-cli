import removeDomClasses from "./removeDomClasses";

describe("removeDomClasses", () => {
  it("Class length must be 0", () => {
    const element = document.createElement("div");
    for (let i = 0, l = 10; i < l; i++) {
      element.classList.add(`class${i}`);
    }

    removeDomClasses(element);

    expect(element.classList.length).toEqual(0);
  });
});
