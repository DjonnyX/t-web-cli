interface IElementRefOptions {
    isTextNode?: boolean;
    elementRefType?: keyof HTMLElementTagNameMap;
    selectorName?: string;
}

export default IElementRefOptions;