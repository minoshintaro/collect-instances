import { MasterNameMap } from "../types";
import { generateComponentIdSet } from "./generateSet";
import { getWrapperNode, getMasterName, getInnerText } from "./get";
import { cutText } from "./utilities";

interface Input {
  instance: InstanceNode[];
  selection: SceneNode[];
}
export function createInstanceCatalog(input: Input): MasterNameMap {
  const targetIds: Set<string> = generateComponentIdSet(input.selection);
  const map: MasterNameMap = new Map();
  for (const instance of input.instance) {
    if (!instance.visible) continue;

    const component = instance.mainComponent;
    if (!component || (input.selection.length && !targetIds.has(component.id))) continue;

    const wrapper = getWrapperNode(instance);
    if (!wrapper) continue;

    // キー
    const masterName: string = getMasterName(component);
    const content = getInnerText(instance);
    // const content = cutText(getInnerText(instance), 50);

    // バリュー
    // MaseterName, Component Id
    // └ Component Id, Content
    // 　└ Content, Insrance Id
    // 　　└ Instance Id, Props
    const componentIdMap = map.get(masterName) || new Map();
    const contentMap = componentIdMap.get(component.id) || new Map();
    const instanceIdMap = contentMap.get(content) || new Map();
    const props = { location: wrapper.name };

    // セット
    instanceIdMap.set(instance.id, props);
    contentMap.set(content, instanceIdMap);
    componentIdMap.set(component.id, contentMap);
    map.set(masterName, componentIdMap);
  }
  return map;
}
