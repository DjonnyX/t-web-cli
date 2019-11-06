import { IModule, ICClass } from "../../../module";
import { RuntimeErrors } from "../../../runtime";

const getCClass = (cModule: IModule, className: string): ICClass => {
  const cClass = cModule.components[className];

  if (!cClass) {
    throw new Error(RuntimeErrors.REQUESTED_CLASS_NOT_EXPORTED);
  }

  return cClass;
};
export default getCClass;
