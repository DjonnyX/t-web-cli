import { IModule, IModules, IModuleCmponents } from "./interfaces";

/**
 * Collects application dependencies
 */
class CModule implements IModule {

  public set modules(modules: IModules) {
    for (const name in modules) {
      const m = modules[name];
      this.components = m.components;
    }
  }

  public set components(components: IModuleCmponents) {
    for (const name in components) {
      const CClass = components[name];
      this._components[(CClass as any).meta.selectorName] = CClass;
    }
  }

  public get components(): IModuleCmponents {
    return this._components;
  }

  private _components: IModuleCmponents = {};
}
export default CModule;
