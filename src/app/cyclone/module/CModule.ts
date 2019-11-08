import { IModule } from "./interfaces";
import { Component } from "../display";

interface IModuleCmponents {
  [x: string]: new () => Component<any>;
}

/**
 * Collects application dependencies
 */
class CModule implements IModule {

  public set components(value: IModuleCmponents) {
    for (const iterator in value) {
      const CClass = value[iterator];
      this._components[(CClass as any).meta.selectorName] = CClass;
    }
  }

  public get components(): IModuleCmponents {
    return this._components;
  }

  private _components: IModuleCmponents = {};
}
export default CModule;
