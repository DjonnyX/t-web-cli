import App from "./app/App";
import { mount } from "./app/controls/utils/dom";
import "./style.scss";

export const createApp = (): void => {
  const app = new App();

  mount(document.body, app.nativeElement.element);
};

createApp();
