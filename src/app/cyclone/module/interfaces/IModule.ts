import { Component } from "../../display";

interface IModule {
    components: {
        [x: string]: new () => Component<any>;
    };
}
export default IModule;