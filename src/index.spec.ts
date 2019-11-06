import { JSDOM } from "jsdom";
import { createApp } from "./index";

const { window } = new JSDOM("./src/index.html");

createApp();

test("createApp", () => {
  expect(window.document).toBeDefined();
});
