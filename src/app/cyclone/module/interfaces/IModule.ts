import { Component } from "../../display";

export interface IModuleCmponents {
  [x: string]: new () => Component<any>;
}

export interface IModules {
  [x: string]: IModule;
}

interface IModule {
  components: IModuleCmponents;
  modules: IModules;
}
export default IModule;
