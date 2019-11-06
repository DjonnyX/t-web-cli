/* eslint-disable @typescript-eslint/no-empty-interface */
import { IElementRefOptions } from "../base/interfaces";
import { IModule } from "../../module";

interface IComponentOptions extends IElementRefOptions {
    template?: string;
    cModule?: IModule;
}
export default IComponentOptions;
