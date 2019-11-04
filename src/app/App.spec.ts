import App from "./App";

test("The App must be initialized.", () => {
  const app = new App();
  expect(document.contains(app.nativeElement.element)).toBeDefined();
});
