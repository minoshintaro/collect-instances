import { InstanceData } from "../types";

export function compareWordOrder(a: string, b: string): number {
  return a.localeCompare(b, 'ja-JP-u-co-standard');
}

type StackedData = { content: string, ids: string[] };
export function stackInstanceIdByContent(stackedDataList: StackedData[], data: InstanceData): StackedData[] {
  const { id, content } = data;
  const stackedData = stackedDataList.find(item => item.content === content);
  if (stackedData) {
    stackedData.ids.push(id);
  } else {
    stackedDataList.push({ content: content, ids: [id] });
  }
  return stackedDataList;
}
