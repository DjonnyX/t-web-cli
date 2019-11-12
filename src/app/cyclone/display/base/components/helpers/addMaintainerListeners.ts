import NodeComponent from "../NodeComponent";
import { IMaintainerListener } from "../../../interfaces";

const addMaintainerListeners = (
  maintainer: NodeComponent<Node>,
  listeners: IMaintainerListener
): void => {
  for (const k in listeners) {

    const intEvent = maintainer.addInteractionEvent(k);

    maintainer.bindInteractionHandler(intEvent, listeners[k]);
  }
};
export default addMaintainerListeners;
