import { Component } from "../../display";

interface IModule {
    components: {
        [x: string]: new () => Component;
    };
}
export default IModule;