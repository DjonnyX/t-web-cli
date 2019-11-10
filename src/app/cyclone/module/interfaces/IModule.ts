import { BaseComponent, IComponentOptions } from "../../display";

export interface IModuleCmponents {
  [x: string]: new (options: IComponentOptions) => BaseComponent<any>;
}

export interface IModules {
  [x: string]: IModule;
}

interface IModule {
  components: IModuleCmponents;
  modules: IModules;
}
export default IModule;
