import { SEGMENT_REGEX, TAG_REGEX, TAG_NAME, LEAD_TAG_REGEX, CLOSURE_TAG_REGEX } from "./regex";

describe("serializer.helper.regex", () => {
  it("SEGMENT_REGEX", () => {
    const a =
      '<div class="tc-1">\n      some text\n</div>\n        <span> d\n    d</span><span>\n    </div>';

    const m = a.match(SEGMENT_REGEX);

    const c1 = m[0] === '<div class="tc-1">\n      some text\n';
    const c2 = m[1] === "</div>\n        ";
    const c3 = m[2] === "<span> d\n    d";
    const c4 = m[3] === "</span>";
    const c5 = m[4] === "<span>\n    ";
    const c6 = m[5] === "</div>";

    expect(c1 && c2 && c3 && c4 && c5 && c6).toBeTruthy();
  });

  it("TAG_REGEX", () => {
    const a = '<div class="tc-1">\n      test text\n';

    const m = a.match(TAG_REGEX);

    const c = m[0] === '<div class="tc-1">';

    expect(m.length === 1 && c).toBeTruthy();
  });

  it("TAG_NAME", () => {
    const a = '<div class="tc-1">';

    const m = a.match(TAG_NAME);

    const c = m[0] === "div";

    expect(c).toBeTruthy();
  });

  it("LEAD_TAG_REGEX", () => {
    const a = "<a>";
    const b = "</a>";

    const c1 = LEAD_TAG_REGEX.test(a);
    const c2 = LEAD_TAG_REGEX.test(b);

    expect(c1 && !c2).toBeTruthy();
  });

  it("CLOSURE_TAG_REGEX", () => {
    const a = "<div>";
    const b = "</div>";

    const c1 = CLOSURE_TAG_REGEX.test(a);
    const c2 = CLOSURE_TAG_REGEX.test(b);

    expect(!c1 && c2).toBeTruthy();
  });
});
