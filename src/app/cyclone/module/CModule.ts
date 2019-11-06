import { IModule } from "./interfaces";
import { Component } from "../display";

class CModule implements IModule {
    public components!: {
        [x: string]: new () => Component<any>;
    };
}
export default CModule;