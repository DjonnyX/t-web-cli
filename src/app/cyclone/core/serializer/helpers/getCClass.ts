import { IModule, ICClass } from "../../../module";

const getCClass = (cModule: IModule, selectorName: string): ICClass => {
  return cModule.components[selectorName];
};
export default getCClass;
