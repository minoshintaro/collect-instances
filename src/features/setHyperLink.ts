export function setHyperlink(textNode: TextNode, id: string): void {
  textNode.hyperlink = {
    type: "NODE",
    value: id
  };
}
