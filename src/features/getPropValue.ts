import { convertStyleId, convertFills } from "./convert";

export function getPropValue(node: SceneNode, prop: NodeChangeProperty): string | null {
  let key: string = `${prop}`;
  let value: string | null = null;

  switch (prop) {
    case 'name':
    case 'exportSettings':
      break;
    case 'componentProperties':
      if ('componentProperties' in node) {
        value = JSON.stringify(node.componentProperties);
      }
      break;
    case 'characters':
      if ('characters' in node) {
        key = 'content';
        value = `\"${node.characters}\"`;
      }
      break;
    case 'opacity':
      if ('opacity' in node) {
        value = String(Math.floor(node.opacity * 100) / 100);
      }
      break;
    case 'width':
      if ('width' in node) {
        value = String(Math.floor(node.width * 10) / 10);
      }
      break;
    case 'height':
      if ('height' in node) {
        value = String(Math.floor(node.height * 10) / 10);
      }
      break;
    case 'fontName':
      if ('fontName' in node) {
        value = JSON.stringify(node.fontName);
      }
      break;
    case 'fills':
      if ('fills' in node) {
        value = convertFills(node.fills);
      }
      break;
    case 'fillStyleId':
      if ('fillStyleId' in node) {
        key = prop.replace('Id', '');
        value = `\"${convertStyleId(node.fillStyleId)}\"`;
      }
      break;
    case 'strokeStyleId':
      if ('strokeStyleId' in node) {
        key = prop.replace('Id', '');
        value = `\"${convertStyleId(node.strokeStyleId)}\"`;
      }
      break;
    case 'backgroundStyleId':
      if ('backgroundStyleId' in node) {
        key = prop.replace('Id', '');
        value = `\"${convertStyleId(node.backgroundStyleId)}\"`;
      }
      break;
    case 'textStyleId':
      if ('textStyleId' in node) {
        key = prop.replace('Id', '');
        value = `\"${convertStyleId(node.textStyleId)}\"`;
      }
      break;
    case 'effectStyleId':
      if ('effectStyleId' in node) {
        key = prop.replace('Id', '');
        value = `\"${convertStyleId(node.effectStyleId)}\"`;
      }
      break;
    default:
      const checkedValue = (function() {
        switch (node.type) {
          case 'BOOLEAN_OPERATION': return node[prop as keyof BooleanOperationNode];
          case 'ELLIPSE': return node[prop as keyof EllipseNode];
          case 'FRAME': return node[prop as keyof FrameNode];
          case 'GROUP': return node[prop as keyof GroupNode];
          case 'INSTANCE': return node[prop as keyof InstanceNode];
          case 'LINE': return node[prop as keyof LineNode];
          case 'POLYGON': return node[prop as keyof PolygonNode];
          case 'RECTANGLE': return node[prop as keyof RectangleNode];
          case 'TEXT': return node[prop as keyof TextNode];
          case 'VECTOR': return node[prop as keyof VectorNode];
          default: return 'STRANGER';
        }
      })();
      value = String(checkedValue);
      break;
  }
  return value ? `${key}: ${value}` : null;
}
