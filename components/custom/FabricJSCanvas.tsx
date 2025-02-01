import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import {
  canvasAtom,
  canvasObjectsAtom,
  selectedObjPropsAtom,
} from "@/utils/atom";
import {
  removeObject,
  initializeCanvas,
  copyObject,
  pasteObject,
  getSelectedObjProperties,
  handleObjectSnap,
  initializeHorizontalLine,
  initializeVerticalLine,
} from "@/utils/fabricUtils";
import {
  BasicTransformEvent,
  FabricImage,
  FabricObject,
  IText,
  ModifiedEvent,
  TPointerEvent,
} from "fabric";

export const FabricJSCanvas = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const rectCounter = useRef(1);
  const circleCounter = useRef(1);
  const setSelectedObjProps = useSetAtom(selectedObjPropsAtom);
  const setCanvas = useSetAtom(canvasAtom);
  const setObjects = useSetAtom(canvasObjectsAtom);

  useEffect(() => {
    const canvas = initializeCanvas(canvasEl.current as HTMLCanvasElement);
    const horizontalLine = initializeHorizontalLine(canvas);
    const verticalLine = initializeVerticalLine(canvas);
    setCanvas(canvas);

    const resizeCanvas = () => {
      const parent = document.getElementById("canvas-container");
      if (parent) {
        canvas.setWidth(parent.clientWidth);
        canvas.setHeight(parent.clientWidth);
        canvas.requestRenderAll();
      }
    };
    resizeCanvas();

    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if (
        e.key === "Backspace" &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        removeObject(canvas);
      } else if (e.ctrlKey && e.key === "c") {
        copyObject(canvas);
      } else if (e.ctrlKey && e.key === "v") {
        pasteObject(canvas);
      }
    };

    const handleObjectAdded = (e: { target: FabricObject }) => {
      const obj = e.target;
      if (obj) {
        if (obj.type === "rect") {
          obj.set("name", `Rect ${rectCounter.current}`);
          rectCounter.current += 1;
        } else if (obj.type === "circle") {
          obj.set("name", `Circle ${circleCounter.current}`);
          circleCounter.current += 1;
        } else if (obj.type === "i-text") {
          obj.set("name", (obj as IText).text);
        }
        updateCanvasObjects();
      }
    };

    const updateCanvasObjects = () => {
      const canvasObjects: FabricObject[] = [];
      canvas.getObjects().forEach((obj) => {
        const imgObj = obj as FabricImage;
        if (
          obj.type === "rect" ||
          obj.type === "circle" ||
          obj.type === "i-text" ||
          (obj.type === "image" &&
            obj.name !== "canvasTemplate" &&
            !imgObj.getSrc().includes("shirtTemplateFront") &&
            !imgObj.getSrc().includes("shirtTemplateBack"))
        ) {
          canvasObjects.push(obj);
        }
      });
      setObjects(canvasObjects);
    };

    const handleObjectModified = (e: ModifiedEvent<TPointerEvent>) => {
      const obj = e.target;
      if (obj && obj.type === "i-text") {
        obj.set("name", (obj as IText).text);
      }
      updateCanvasObjects();
    };

    const handleSelection = () => {
      const properties = getSelectedObjProperties(canvas);
      setSelectedObjProps(properties);
    };

    const handleObjSnap = (
      e: BasicTransformEvent<TPointerEvent> & {
        target: FabricObject;
      }
    ) => {
      handleSelection();
      handleObjectSnap(e, canvas, horizontalLine, verticalLine);
    };

    const handleSelectionClear = () => {
      setSelectedObjProps(null);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("keydown", handleKeyboardShortcut);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelectionClear);
    canvas.on("object:added", handleObjectAdded);
    canvas.on("object:removed", updateCanvasObjects);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:scaling", handleSelection);
    canvas.on("object:rotating", handleSelection);
    canvas.on("object:skewing", handleSelection);
    canvas.on("object:resizing", handleSelection);
    canvas.on("object:moving", handleObjSnap);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyboardShortcut);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleSelectionClear);
      canvas.off("object:added", handleObjectAdded);
      canvas.off("object:removed", updateCanvasObjects);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:scaling", handleSelection);
      canvas.off("object:rotating", handleSelection);
      canvas.off("object:skewing", handleSelection);
      canvas.off("object:resizing", handleSelection);
      canvas.off("object:moving", handleObjSnap);

      canvas.dispose();
    };
  }, [setCanvas, setObjects, setSelectedObjProps]);

  return <canvas id="canvas" ref={canvasEl}></canvas>;
};
