import { FILE_ID } from "../settings";

export function createUrl(name: string, id: string): string {
  return `https://www.figma.com/file/${FILE_ID}/${name}?node-id=${id}`;
}


