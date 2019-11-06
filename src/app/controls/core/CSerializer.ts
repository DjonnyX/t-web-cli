import { RuntimeErrors } from "../runtime";
import { Component } from "../display";

const TAG_REGEX = /<.([^r>][^>]*)?>|>?.([^r<][^<]*)?/g;
const REPL_REGEX = /{{.([^r}}][^}}])?}}/;
const LEAD_TAG_REGEX = /<.([^r>][^>]*)?>/;
const CLOSURE_TAG_REGEX = /<.([^r\/>][^\/>]*)?\/>/;

class CSerializer<E extends keyof HTMLElementTagNameMap = any> {

    constructor(owner: Component<E>, template: string) {
        this.parse(owner, template);
    }

    protected parse(owner: Component<E>, template: string) {
        const segments = template.match(template);

        if (!segments) {
            throw new Error(RuntimeErrors.WRONG_TEMPLATE);
        }

        let mounter = owner;

        for (let i = 0, l = segments.length; i < l; i ++) {
            const s = segments[i];
            if (CLOSURE_TAG_REGEX.test(s)) {
                mounter = mounter.parent;
                continue;
            }

            if (LEAD_TAG_REGEX.test(s)) {
                // const selector = 
                // mounter.addChild()
            }
        }
    }
}

export default CSerializer;
