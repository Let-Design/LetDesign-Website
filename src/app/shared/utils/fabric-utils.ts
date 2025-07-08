import * as fabric from 'fabric';
import {
  CircleProperty,
  ObjectProperty,
  RectangleProperty,
  SelectedObjectProperty,
  TextProperty,
} from '../../types/editor.types';

declare module 'fabric' {
  interface FabricObject {
    id?: number;
    name?: string;
  }

  interface SerializedObjectProps {
    id?: number;
    name?: string;
  }
}
fabric.FabricObject.customProperties = ['id', 'name'];

const snapZone = 15;

/**
 * Initialize a Fabric canvas
 * @param canvas Reference for canvas element
 * @returns Canvas object
 */
export const initializeCanvas = (canvas: HTMLCanvasElement): fabric.Canvas => {
  return new fabric.Canvas(canvas);
};

/**
 * Initialize the canvas to a custom image shape
 * @param canvas Reference to a canvas
 * @param canvasImg Image that is use as background
 */
export const initializeImgCanvas = (
  canvas: fabric.Canvas,
  canvasImg: string
) => {
  canvas.controlsAboveOverlay = true;

  fabric.FabricImage.fromURL(canvasImg).then((img) => {
    img.scaleToWidth(700);
    img.set({
      name: 'canvasTemplate',
      selectable: false,
      evented: false,
    });

    canvas.add(img);
    canvas.centerObject(img);
    canvas.sendObjectToBack(img);

    canvas.clipPath = img;
  });
};

/**
 * Create a horizontal line in the middle of the canvas
 * @param canvas Reference to a canvas
 * @returns Line object
 */
export const initializeHorizontalLine = (canvas: fabric.Canvas) => {
  return new fabric.Line(
    [(canvas.width ?? 0) / 2, 0, (canvas.width ?? 0) / 2, canvas.width ?? 0],
    {
      stroke: 'red',
      evented: false,
      selectable: false,
    }
  );
};

/**
 * Create a vertical line in the middle of the canvas
 * @param canvas Reference to a canvas
 * @returns Line object
 */
export const initializeVerticalLine = (canvas: fabric.Canvas) => {
  return new fabric.Line(
    [0, (canvas.height ?? 0) / 2, canvas.width ?? 0, (canvas.height ?? 0) / 2],
    {
      stroke: 'red',
      evented: false,
      selectable: false,
    }
  );
};

/**
 * Add a rectangle to the canvas
 * @param canvas Reference to a canvas
 * @param options Rectangle options
 */
export const addRectangle = (
  canvas: fabric.Canvas,
  options?: fabric.TOptions<fabric.RectProps>
) => {
  let rect: fabric.Rect;

  if (options) {
    rect = new fabric.Rect({
      ...options,
    });
  } else {
    rect = new fabric.Rect({
      width: 100,
      height: 50,
      fill: '#000000',
    });
  }

  canvas.add(rect);
  canvas.centerObject(rect);
  canvas.setActiveObject(rect);
};

/**
 * Add a circle to the canvas
 * @param canvas Reference to a canvas
 * @param options Circle options
 */
export const addCircle = (
  canvas: fabric.Canvas,
  options?: fabric.TOptions<fabric.CircleProps>
) => {
  let circle: fabric.Circle;

  if (options) {
    circle = new fabric.Circle(options);
  } else {
    circle = new fabric.Circle({
      fill: '#000000',
      radius: 30,
    });
  }

  canvas.add(circle);
  canvas.centerObject(circle);
  canvas.setActiveObject(circle);
};

/**
 * Add a custom text to the canvas
 * @param canvas Reference to a canvas
 * @param text String text
 * @param options Text options
 */
export const addText = (
  canvas: fabric.Canvas,
  text?: string,
  options?: fabric.TOptions<fabric.ITextProps>
) => {
  let fabricText: fabric.IText;

  if (text || options) {
    fabricText = new fabric.IText(text ?? 'Text', options);
  } else {
    fabricText = new fabric.IText('Text', { fill: '#000000' });
  }
  canvas.add(fabricText);
  canvas.centerObject(fabricText);
  canvas.setActiveObject(fabricText);
};

/**
 * Toggle into draw mode in the canvas
 * @param canvas Reference to a canvas
 */
export const toggleDrawMode = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = !canvas.isDrawingMode;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = 10;
};

/**
 * Get the active object properties
 * @param canvas Reference to a canvas
 * @returns Selected object properties
 */
export const getSelectedObjProperties = (canvas: fabric.Canvas): SelectedObjectProperty | null => {
  const selectedObj = canvas.getActiveObject();
  if (!selectedObj) return null;

  let selectedObjProperties: SelectedObjectProperty = null;
  const actualWidth = (selectedObj.width! * selectedObj.scaleX!).toFixed(2);
  const actualHeight = (selectedObj.height! * selectedObj.scaleY!).toFixed(2);
  const left = selectedObj.left!.toFixed(2);
  const top = selectedObj.top!.toFixed(2);
  const angle = selectedObj.angle!.toFixed(2);

  const commonProp: ObjectProperty = {
    width: parseFloat(actualWidth),
    height: parseFloat(actualHeight),
    x: parseFloat(left),
    y: parseFloat(top),
    angle: parseFloat(angle),
    fill: selectedObj.fill,
    type: selectedObj.type,
  };

  if (selectedObj.isType('rect')) {
    selectedObjProperties = {
      ...commonProp,
      cornerRadius: (selectedObj as fabric.Rect).rx,
    } as RectangleProperty;
  } else if (selectedObj.isType('circle')) {
    selectedObjProperties = {
      ...commonProp,
      radius: (selectedObj as fabric.Circle).radius,
    } as CircleProperty;
  } else if (selectedObj.isType('i-text')) {
    selectedObjProperties = {
      ...commonProp,
      fontFamily: (selectedObj as fabric.IText).fontFamily,
      fontWeight: (selectedObj as fabric.IText).fontWeight,
      fontSize: (selectedObj as fabric.IText).fontSize,
      textDecoration: {
        underline: (selectedObj as fabric.IText).underline,
        strikethrough: (selectedObj as fabric.IText).linethrough,
        overline: (selectedObj as fabric.IText).overline,
      },
      fontStyle: (selectedObj as fabric.IText).fontStyle,
      stroke: (selectedObj as fabric.IText).stroke,
      strokeWidth: (selectedObj as fabric.IText).strokeWidth,
      textAlign: (selectedObj as fabric.IText).textAlign,
      lineHeight: (selectedObj as fabric.IText).lineHeight,
    } as TextProperty;
  } else if (
    selectedObj.isType('image') &&
    selectedObj.name !== 'canvasTemplate'
  ) {
    selectedObjProperties = { ...commonProp, scaleX: 0.2, scaleY: 0.2 };
  }

  return selectedObjProperties;
};

/**
 * Get the active object properties
 * @param canvas Reference to a canvas
 * @param selectedObjProps Reference to the selected object properties
 */
export const updateSelectedObjProperties = (
  canvas: fabric.Canvas,
  selectedObjProps: SelectedObjectProperty
) => {
  const activeObject = canvas.getActiveObject();
  if (activeObject && selectedObjProps) {
    const commonProp = {
      left: selectedObjProps.x,
      top: selectedObjProps.y,
      width: selectedObjProps.width,
      height: selectedObjProps.height,
      angle: selectedObjProps.angle,
      fill: selectedObjProps.fill,
      scaleX: 1,
      scaleY: 1,
    };

    if (activeObject?.type === 'rect') {
      activeObject.set({
        ...commonProp,
        rx: (selectedObjProps as RectangleProperty).cornerRadius,
        ry: (selectedObjProps as RectangleProperty).cornerRadius,
      } as fabric.Rect);
    } else if (activeObject?.type === 'circle') {
      activeObject.set({
        ...commonProp,
        radius: (selectedObjProps as CircleProperty).radius,
      } as fabric.Circle);
    } else if (activeObject?.type === 'i-text') {
      (activeObject as fabric.IText).set({
        ...commonProp,
        fontFamily: (selectedObjProps as TextProperty).fontFamily,
        fontSize: (selectedObjProps as TextProperty).fontSize,
        fontWeight: (selectedObjProps as TextProperty).fontWeight,
        underline: (selectedObjProps as TextProperty).textDecoration?.underline,
        linethrough: (selectedObjProps as TextProperty).textDecoration
          ?.strikethrough,
        overline: (selectedObjProps as TextProperty).textDecoration?.overline,
        fontStyle: (selectedObjProps as TextProperty).fontStyle,
        stroke: (selectedObjProps as TextProperty).stroke,
        strokeWidth: (selectedObjProps as TextProperty).strokeWidth,
        textAlign: (selectedObjProps as TextProperty).textAlign,
        lineHeight: (selectedObjProps as TextProperty).lineHeight,
      });
    } else if (
      activeObject?.type === 'image' &&
      activeObject?.name !== 'canvasTemplate'
    ) {
      (activeObject as fabric.Image).set({
        ...commonProp,
        scaleX: 0.2,
        scaleY: 0.2,
      });
    }

    canvas.discardActiveObject();
    canvas.setActiveObject(activeObject);
    canvas.requestRenderAll();
  }
};

// /**
//  * Display the active object properties
//  * @param canvas Reference to a canvas
//  * @param setShowProperty A setter function for showProperty state
//  * @param setSelectedObj A setter function for selectedObject
//  */
// export const displaySelectedObj = (
//   canvas: fabric.Canvas,
//   setShowProperty: (value: SetStateAction<boolean>) => void,
//   setSelectedObj: (value: SetStateAction<SelectedObjectProperty | null>) => void
// ) => {
//   const selectedObj = canvas.getActiveObject();
//   if (selectedObj) {
//     setShowProperty(true);
//     const actualWidth = (selectedObj.width! * selectedObj.scaleX!).toFixed(2);
//     const actualHeight = (selectedObj.height! * selectedObj.scaleY!).toFixed(2);
//     const left = selectedObj.left!.toFixed(2);
//     const top = selectedObj.top!.toFixed(2);
//     const angle = selectedObj.angle!.toFixed(2);

//     const commonProp: ObjectProperty = {
//       width: parseFloat(actualWidth),
//       height: parseFloat(actualHeight),
//       x: parseFloat(left),
//       y: parseFloat(top),
//       angle: parseFloat(angle),
//       fill: selectedObj.fill,
//       type: selectedObj.type,
//     };

//     if (selectedObj.isType("rect")) {
//       setSelectedObj({
//         ...commonProp,
//         cornerRadius: (selectedObj as fabric.Rect).rx,
//       } as RectangleProperty);
//     } else if (selectedObj.isType("circle")) {
//       setSelectedObj({
//         ...commonProp,
//         radius: (selectedObj as fabric.Circle).radius,
//       } as CircleProperty);
//     } else if (selectedObj.isType("i-text")) {
//       setSelectedObj({
//         ...commonProp,
//         fontFamily: (selectedObj as fabric.IText).fontFamily,
//         fontWeight: (selectedObj as fabric.IText).fontWeight,
//         fontSize: (selectedObj as fabric.IText).fontSize,
//         textDecoration: {
//           underline: (selectedObj as fabric.IText).underline,
//           strikethrough: (selectedObj as fabric.IText).linethrough,
//           overline: (selectedObj as fabric.IText).overline,
//         },
//         fontStyle: (selectedObj as fabric.IText).fontStyle,
//         stroke: (selectedObj as fabric.IText).stroke,
//         strokeWidth: (selectedObj as fabric.IText).strokeWidth,
//         textAlign: (selectedObj as fabric.IText).textAlign,
//         lineHeight: (selectedObj as fabric.IText).lineHeight,
//       } as TextProperty);
//     } else if (
//       selectedObj.isType("image") &&
//       selectedObj.name !== "canvasTemplate"
//     ) {
//       setSelectedObj({ ...commonProp, scaleX: 0.2, scaleY: 0.2 });
//     }
//   }
// };

// /**
//  * Update the display of an active object properties
//  * @param canvas Reference to a canvas
//  */
// export const updateSelectedObj = (
//   canvas: fabric.Canvas,
//   setSelectedObj: (value: SetStateAction<SelectedObjectProperty | null>) => void
// ) => {
//   const selectedObj = canvas.getActiveObject();
//   if (selectedObj) {
//     const actualWidth = (selectedObj.width! * selectedObj.scaleX!).toFixed(2);
//     const actualHeight = (selectedObj.height! * selectedObj.scaleY!).toFixed(2);
//     const left = selectedObj.left!.toFixed(2);
//     const top = selectedObj.top!.toFixed(2);
//     const angle = selectedObj.angle!.toFixed(2);

//     const commonProp: ObjectProperty = {
//       width: parseFloat(actualWidth),
//       height: parseFloat(actualHeight),
//       x: parseFloat(left),
//       y: parseFloat(top),
//       angle: parseFloat(angle),
//       fill: selectedObj.fill,
//       type: selectedObj.type,
//     };

//     if (selectedObj.isType("rect")) {
//       setSelectedObj({
//         ...commonProp,
//         cornerRadius: (selectedObj as fabric.Rect).rx,
//       } as RectangleProperty);
//     } else if (selectedObj.isType("circle")) {
//       const selectedCircleObj = selectedObj as fabric.Circle;
//       setSelectedObj({
//         ...commonProp,
//         radius:
//           selectedCircleObj.radius && selectedCircleObj.scaleX
//             ? selectedCircleObj.radius * selectedCircleObj.scaleX
//             : selectedCircleObj.radius,
//         scaleX: 1,
//         scaleY: 1,
//       } as CircleProperty);
//     } else if (selectedObj.isType("i-text")) {
//       setSelectedObj({
//         ...commonProp,
//         fontFamily: (selectedObj as fabric.IText).fontFamily,
//         fontWeight: (selectedObj as fabric.IText).fontWeight,
//         fontSize: (selectedObj as fabric.IText).fontSize,
//         textDecoration: {
//           underline: (selectedObj as fabric.IText).underline,
//           strikethrough: (selectedObj as fabric.IText).linethrough,
//           overline: (selectedObj as fabric.IText).overline,
//         },
//         fontStyle: (selectedObj as fabric.IText).fontStyle,
//         stroke: (selectedObj as fabric.IText).stroke,
//         strokeWidth: (selectedObj as fabric.IText).strokeWidth,
//         textAlign: (selectedObj as fabric.IText).textAlign,
//         lineHeight: (selectedObj as fabric.IText).lineHeight,
//       } as TextProperty);
//     } else if (
//       selectedObj.isType("image") &&
//       selectedObj.name !== "canvasTemplate"
//     ) {
//       setSelectedObj({ ...commonProp, scaleX: 0.2, scaleY: 0.2 });
//     }
//   }
// };

/**
 * Function to enable snapping to middle point for both horizontally and vertically
 * @param options Reference to the selected object
 * @param canvas Reference to a canvas
 * @param horizontalLine Reference to the horizontal line
 * @param verticalLine Reference to the vertical line
 */
export const handleObjectSnap = (
  options: fabric.BasicTransformEvent<fabric.TPointerEvent> & {
    target: fabric.FabricObject;
  },
  canvas: fabric.Canvas,
  horizontalLine: fabric.Line,
  verticalLine: fabric.Line
) => {
  const objectMiddleHorizontal =
    (options.target.left ?? 0) +
    ((options.target.width ?? 0) * (options.target.scaleX ?? 1)) / 2;

  if (
    objectMiddleHorizontal > (canvas.width ?? 0) / 2 - snapZone &&
    objectMiddleHorizontal < (canvas.width ?? 0) / 2 + snapZone
  ) {
    options.target
      ?.set({
        left:
          (canvas.width ?? 0) / 2 -
          ((options.target.width ?? 0) * (options.target.scaleX ?? 0)) / 2,
      })
      .setCoords();

    canvas.add(horizontalLine);

    document.addEventListener('mouseup', () => {
      canvas.remove(horizontalLine);
    });
  } else {
    canvas.remove(horizontalLine);
  }

  const objectMiddleVertical =
    (options.target?.top ?? 0) +
    ((options.target?.height ?? 0) * (options.target?.scaleY ?? 1)) / 2;

  if (
    objectMiddleVertical > (canvas.height ?? 0) / 2 - snapZone &&
    objectMiddleVertical < (canvas.height ?? 0) / 2 + snapZone
  ) {
    options.target
      ?.set({
        top:
          (canvas.height ?? 0) / 2 -
          ((options.target.height ?? 0) * (options.target.scaleY ?? 0)) / 2,
      })
      .setCoords();

    canvas.add(verticalLine);

    document.addEventListener('mouseup', () => {
      canvas.remove(verticalLine);
    });
  } else {
    canvas.remove(verticalLine);
  }
};

/**
 * Remove the current selected object from the canvas
 * @param canvas reference to a canvas
 * @returns
 */
export const removeObject = (canvas: fabric.Canvas | null): void => {
  const activeObject = canvas?.getActiveObject();

  if (!canvas || !activeObject) return;

  // If text object is editing don't delete
  if (activeObject.type == 'i-text') {
    const textObj = activeObject as fabric.IText;
    if (textObj.isEditing) {
      return;
    }
  }

  // Handle object group delete
  if (activeObject.isType('activeselection')) {
    const objGroup = activeObject as fabric.Group;
    objGroup.forEachObject((obj) => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject();
  } else {
    // Handle single object delete
    canvas.remove(activeObject);
  }
};

let _clipboard: fabric.FabricObject;
/**
 * Function to enable the ability to copy object
 * @param canvas Reference to a canvas
 */
export const copyObject = (canvas: fabric.Canvas) => {
  if (canvas) {
    const selectedObj = canvas.getActiveObject();
    if (selectedObj) {
      selectedObj.clone().then((cloned: fabric.FabricObject) => {
        _clipboard = cloned;
      });
    }
  }
};

/**
 * Function to enable the ability to paste object
 * @param canvas Reference to a canvas
 */
export const pasteObject = async (canvas: fabric.Canvas) => {
  if (canvas && _clipboard) {
    const clonedObj = await _clipboard.clone();
    canvas.discardActiveObject();

    clonedObj.set({
      left: clonedObj.left! + 10,
      top: clonedObj.top! + 10,
      evented: true,
    });

    if (clonedObj.isType('activeselection')) {
      clonedObj.canvas = canvas;
      (clonedObj as fabric.Group).forEachObject((obj) => {
        canvas.add(obj);
      });
      clonedObj.setCoords();
    } else {
      canvas.add(clonedObj);
    }

    _clipboard.top += 10;
    _clipboard.left += 10;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
  }
};

/**
 * Save the canvas objects into a JSON format for storing
 * @param canvas Reference to a canvas
 * @returns An JSON object of canvas data
 */
export const saveCanvas = (canvas: fabric.Canvas | null) => {
  if (!canvas) return;
  return canvas.toJSON();
};

/**
 * Save the canvas objects into a JSON format for storing
 * @param canvas Reference to a canvas
 * @param quality The quality of the converted image
 * @param ignoreSrc Image src that you want to ignore
 * @returns An JSON object of canvas data
 */
export const saveCanvasWithImg = async (
  canvas: fabric.Canvas | null,
  quality = 0.1,
  ignoreSrc?: string | string[]
) => {
  if (!canvas) return;
  const canvasJSON = canvas.toJSON();

  await Promise.all(
    canvasJSON.objects.map(async (obj: fabric.FabricObject) => {
      if (obj.isType('image')) {
        // Why doesn't the fabric.Image type have src when it clearly there!!!!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const element = obj as any;

        const shouldIgnore = Array.isArray(ignoreSrc)
          ? ignoreSrc.includes(element.src)
          : ignoreSrc === element.src;

        if (element && !shouldIgnore) {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = element.src;

          await new Promise<void>((resolve) => {
            img.onload = () => {
              const canvasElement = document.createElement('canvas');
              const context = canvasElement.getContext('2d');
              canvasElement.width = img.width;
              canvasElement.height = img.height;
              context?.drawImage(img, 0, 0);
              element.src = canvasElement.toDataURL('image/jpeg', quality);
              resolve();
            };
          });
        }
      }
    })
  );

  // console.log("After conversion: ", canvasJSON);
  return canvasJSON;
};

/**
 * Convert the canvas to an image object for storing
 * @param canvas Reference to a canvas
 * @param quality The quality of the converted image
 * @returns A data URL of the canvas element
 */
export const getDesignThumbnail = (
  canvas: fabric.Canvas | null,
  quality = 0.1
) => {
  if (!canvas) return;

  const thumbnail = canvas.toDataURL({
    format: 'jpeg',
    quality: quality,
    multiplier: 0,
  });

  return thumbnail;
};

/**
 * Load the canvas objects from a JSON format
 * @param canvas Reference to a canvas
 * @param canvasData Reference to canvas json data
 */
export const loadCanvas = (
  canvas: fabric.Canvas | null,
  canvasData: string
) => {
  if (!canvas) return;
  canvas.loadFromJSON(JSON.parse(canvasData), canvas.renderAll.bind(canvas));
};

/**
 * Clear out the entire canvas
 * @param canvas reference to a canvas
 */
export const clearCanvas = (canvas: fabric.Canvas): void => {
  canvas.clear();
};
