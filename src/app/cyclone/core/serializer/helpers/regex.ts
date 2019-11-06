export const TAG_REGEX = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
export const TAG_NAME = /[\w.]+/;
export const REPL_REGEX = /{{.([^r}}][^}}])?}}/;
export const LEAD_TAG_REGEX = /<.([^r>][^>]*)?>/;
export const CLOSURE_TAG_REGEX = /<.([^r\/>][^\/>]*)?\/>/;
export const ATTRS_REGEX = /\w+\s*=\s*".*?"/g;
export const ATTR_VALUE_REGEX = /\"([^']*?)\"/;
export const ATTR_NAME_REGEX = /[\w-]+(?=[^\"]*\")/;