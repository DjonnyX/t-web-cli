import { mount } from "../utils/dom";
import { timer } from "rxjs";
import TextComponent from "./TextComponent";

class TestComponent extends TextComponent {

  public static instance: TestComponent;

  public get propsForBinding(): ({
    [propName: string]: () => any;
  }) {
    return this._propsForBinding;
  }

  public get innerTextSegments(): ({
    [propName: string]: Function;
  }) {
    return this._innerTextSegments;
  }

  public get innerTextSegmentsOrder(): Array<string> {
    return this._innerTextSegmentsOrder;
  }

  constructor() {
    super();

    TestComponent.instance = this;
  }
}

const isCleared = (components: TestComponent[]): boolean => {
    for (const component of components) {
        if ((component.innerTextSegments && Object.keys((component.innerTextSegments)).length > 0)
        || Object(component.innerTextSegments).keys().length || Object.keys((component.propsForBinding)).length) {
            return false;
        }
    }
    return true;
}

describe("TextComponent", () => {
    const testComponent = new TestComponent();

    const prop = () => {
        return "foo";
    };

    testComponent.addPropertyToContentText("foo", prop);

    testComponent.addTextSegmentToContentText("some text");

    mount(window.document.body, testComponent.nativeElement.element);
    it('innerTextSegments must greater that 0', () => {
        expect(testComponent.innerTextSegmentsOrder.length).toBeGreaterThan(0)
    });

    it('innerTextSegments must greater that 0', () => {
        expect(Object.keys((testComponent.innerTextSegments)).length).toBeGreaterThan(0)
    });

    it('After calling "dispose" all links should clear', () => {
        return timer(10)
        .toPromise()
        .then(() => {
        testComponent.dispose();
        return expect(isCleared([TestComponent.instance])).toBeFalsy();
        });
    });
});
