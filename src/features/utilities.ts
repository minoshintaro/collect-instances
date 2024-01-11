import { MasterNameMap } from "../types";

export function compareWordOrder(a: string, b: string): number {
  return a.localeCompare(b, 'ja-JP-u-co-standard');
}

export function cutText(text: string, max: number) {
  if (text.length > max) return text.slice(0, max);
  return text;
}

export function countInstances(masterNameMap: MasterNameMap): number {
  let totalCount = 0;

  masterNameMap.forEach(componentIdMap => {
    componentIdMap.forEach(contentMap => {
      // contentMap 内の instanceIdMap の数を加算
      totalCount += contentMap.size;
    });
  });

  return totalCount;
}
