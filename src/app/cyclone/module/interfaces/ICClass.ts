import { Component, IComponentOptions } from "../../display";

interface ICClass {
    new (options?: IComponentOptions): Component;
}
export default ICClass;