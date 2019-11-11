import { InputComponent } from ".";

describe("InputComponent", () => {
  for (let i = 0; i < 10; i++) {
    new InputComponent({});
  }

  it("InputComponent count must equal to 10", () => {
    expect(InputComponent.count).toEqual(10);
  });
});
