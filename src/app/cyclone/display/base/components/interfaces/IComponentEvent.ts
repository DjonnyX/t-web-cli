interface IComponentEvent<D = any> {
    type: string;
    data: D;
}
export default IComponentEvent;