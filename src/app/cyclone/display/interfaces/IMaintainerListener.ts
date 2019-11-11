// interface IMaintainerListener<K extends keyof GlobalEventHandlersEventMap = any> {
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
//    [x: K]: string;
//} {}

interface IMaintainerListener {
  [x: string]: string;
}
{
}
export default IMaintainerListener;
