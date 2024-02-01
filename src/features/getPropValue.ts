export function getPropValue(node: BaseNode, input: NodeChangeProperty) {
  const value = (function() {
    switch (node.type) {
      case 'BOOLEAN_OPERATION': return input in node ? node[input as keyof BooleanOperationNode] : null;
      case 'ELLIPSE': return input in node ? node[input as keyof EllipseNode] : null;
      case 'FRAME': return input in node ? node[input as keyof FrameNode] : null;
      case 'GROUP': return input in node ? node[input as keyof GroupNode] : null;
      case 'INSTANCE': return input in node ? node[input as keyof InstanceNode] : null;
      case 'LINE': return input in node ? node[input as keyof LineNode] : null;
      case 'POLYGON': return input in node ? node[input as keyof PolygonNode] : null;
      case 'RECTANGLE': return input in node ? node[input as keyof RectangleNode] : null;
      case 'TEXT': return input in node ? node[input as keyof TextNode] : null;
      case 'VECTOR': return input in node ? node[input as keyof VectorNode] : null;
      default: return null;
    }
  })();

  if (value) {
    // if (['characters'].includes(input)) return null;
    if (['visible', 'opacity', 'blendMode'].includes(input)) return value; // レイヤー：boolean | number | ?
    if (['width', 'height'].includes(input)) return Math.floor(value as number * 100) / 100; // 四捨五入
    if (['componentPropertyReferences'].includes(input)) return JSON.stringify(value); // [object, Object]を変換
    if (input === 'fills') {

      // fills: [{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.8256220817565918,"g":0.43378549814224243,"b":0.43378549814224243},
    }
  }

  // 保留：constraints

  return value;
}


// NodeChangeProperty =

//   | 'name'
//   | 'parent'
//   | 'pluginData'
//   | 'locked'
//   | 'layoutGrids'
//   | 'guides'
//   | 'exportSettings'
//   | 'x'
//   | 'y'
//   | 'type'


//   | 'width'
//   | 'height'
//   | 'minWidth'
//   | 'maxWidth'
//   | 'minHeight'
//   | 'maxHeight'
//   | 'topLeftRadius'
//   | 'topRightRadius'
//   | 'bottomLeftRadius'
//   | 'bottomRightRadius'

//   | 'constraints'
//   | 'constrainProportions'
//   | 'overflowDirection'
//   | 'relativeTransform'

//   | 'visible'
//   | 'opacity'
//   | 'blendMode'


//   | 'fills'
//   | 'effects'

//   | 'strokes'
//   | 'strokeWeight'
//   | 'strokeAlign'
//   | 'strokeCap'
//   | 'strokeJoin'
//   | 'strokeMiterLimit'
//   | 'dashPattern'


// Text
//   | 'characters'
//   | 'styledTextSegments'
//   | 'autoRename'
//   | 'fontName'
//   | 'fontSize'
//   | 'lineHeight'
//   | 'leadingTrim'
//   | 'paragraphIndent'
//   | 'paragraphSpacing'
//   | 'listSpacing'
//   | 'hangingPunctuation'
//   | 'hangingList'
//   | 'letterSpacing'
//   | 'textAlignHorizontal'
//   | 'textAlignVertical'
//   | 'textCase'
//   | 'textDecoration'
//   | 'textAutoResize'
//   | 'textTruncation'
//   | 'maxLines'


// Ellipse
//   | 'arcData'












//   | 'booleanOperation'


// DEPRECATED
//   | 'backgrounds'
//   | 'backgroundStyleId'



// Rectangle
//   | 'cornerRadius'
//   | 'cornerSmoothing'




//   | 'rotation'
//   | 'isMask'
//   | 'maskType'
//   | 'clipsContent'

//   | 'overlayPositionType'
//   | 'overlayBackgroundInteraction'
//   | 'overlayBackground'

//   | 'prototypeStartNode'
//   | 'prototypeBackgrounds'
//   | 'expanded'

//   | 'effectStyleId'
//   | 'gridStyleId'
//   | 'description'
//   | 'layoutMode'
//   | 'layoutWrap'

//   | 'paddingLeft'
//   | 'paddingTop'
//   | 'paddingRight'
//   | 'paddingBottom'
//   | 'itemSpacing'
//   | 'counterAxisSpacing'

//   | 'layoutAlign'
//   | 'counterAxisSizingMode'
//   | 'primaryAxisSizingMode'
//   | 'primaryAxisAlignItems'
//   | 'counterAxisAlignItems'
//   | 'counterAxisAlignContent'
//   | 'layoutGrow'

//   | 'layoutPositioning'
//   | 'itemReverseZIndex'
//   | 'hyperlink'
//   | 'mediaData'

// Frame, Rectangle
//   | 'stokeTopWeight'
//   | 'strokeBottomWeight'
//   | 'strokeLeftWeight'
//   | 'strokeRightWeight'

//   | 'reactions'
//   | 'flowStartingPoints'
//   | 'shapeType'



//   | 'codeLanguage'
//   | 'widgetSyncedState'
//   | 'componentPropertyDefinitions'
//   | 'componentPropertyReferences'
//   | 'componentProperties'
//   | 'embedData'
//   | 'linkUnfurlData'

//   | 'authorVisible'
//   | 'authorName'
//   | 'code'


// Vector
//   | 'vectorNetwork'
//   | 'handleMirroring'


// FigJam

// Star, Polygon
//   | 'pointCount'
//   | 'innerRadius'

// Sticky
//   | 'text'
//   | 'fillStyleId'

//   | 'textStyleId'

// Connector
//   | 'textBackground'
//   | 'connectorStart'
//   | 'connectorEnd'
//   | 'connectorLineType'
//   | 'connectorStartStrokeCap'
//   | 'connectorEndStrokeCap'
//   | 'strokeStyleId'

// Shape
