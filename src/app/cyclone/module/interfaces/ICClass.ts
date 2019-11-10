import { BaseComponent, IComponentOptions } from "../../display";

interface ICClass {
    new (options?: IComponentOptions): BaseComponent;
}
export default ICClass;