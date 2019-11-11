/* eslint-disable @typescript-eslint/no-empty-interface */
import { IElementRefOptions } from "../base/interfaces";
import { IModule } from "../../module";
import IMaintainerOptions from "./IMaintainerOptions";

interface IComponentOptions<M = any> extends IMaintainerOptions, IElementRefOptions {
  maintainer?: IMaintainerOptions;
  template?: string;
  cModule?: IModule;
}
export default IComponentOptions;
