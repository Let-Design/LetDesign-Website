"use client";

import { FabricJSCanvas } from "@/components/custom/FabricJSCanvas";
import InputWithLabel from "@/components/custom/LoginWithLabel";
import { Button } from "@/components/ui/button";
import { SelectedObjectProperty } from "@/types/editor.types";
import {
  canvasAtom,
  canvasObjectsAtom,
  selectedObjPropsAtom,
} from "@/utils/atom";
import {
  addRectangle,
  addCircle,
  addText,
  toggleDrawMode,
  saveCanvas,
  updateSelectedObjProperties,
} from "@/utils/fabricUtils";
import { Canvas } from "fabric";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";

export default function Editor() {
  const canvas = useAtomValue(canvasAtom);
  const [selectedObjProps, setSelectedObjProps] = useAtom(selectedObjPropsAtom);
  const objects = useAtomValue(canvasObjectsAtom);
  const [drawMode, SetDrawMode] = useState(canvas?.isDrawingMode);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    acceptString: boolean = false
  ) => {
    const { name, value } = e.target;

    setSelectedObjProps({
      ...selectedObjProps,
      [name]: acceptString ? value : Number(value),
    } as SelectedObjectProperty);

    if (name === "fill") {
      handleOnBlur();
    }
  };

  // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;

  //   setSelectedObjProps({
  //     ...selectedObjProps,
  //     [name]: value,
  //   } as SelectedObjectProperty);

  //   handleOnBlur();
  // };

  const handleOnBlur = () => {
    if (canvas && selectedObjProps) {
      updateSelectedObjProperties(canvas, selectedObjProps);
    }
  };

  return (
    <div className="grid py-6 grid-cols-[300px_1fr_300px]">
      {/* Display the object list */}
      <div className="border-2 rounded-md p-4 flex flex-col gap-4">
        <p className="">Objects</p>
        {objects ? (
          objects.map((obj) => <div key={obj.name}>{obj.name}</div>)
        ) : (
          <div>No objects</div>
        )}
      </div>

      <main>
        <div className="flex mb-4 ml-[5%] gap-4 items-center">
          <Button
            className="shadow-md min-w-[100px]"
            onClick={() => addRectangle(canvas as Canvas)}
          >
            Add Rect
          </Button>
          <Button
            className="shadow-md min-w-[100px]"
            onClick={() => addCircle(canvas as Canvas)}
          >
            Add Circle
          </Button>
          <Button
            className="shadow-md min-w-[100px]"
            onClick={() => addText(canvas as Canvas)}
          >
            Add Text
          </Button>
          <Button
            className="shadow-md min-w-[100px]"
            onClick={() => {
              SetDrawMode(!drawMode);
              toggleDrawMode(canvas as Canvas);
            }}
          >
            {drawMode ? "Cancel" : "Draw"}
          </Button>
          <Button
            className="shadow-md min-w-[100px]"
            onClick={() => saveCanvas(canvas as Canvas)}
          >
            Save
          </Button>
        </div>

        <div
          id="canvas-container"
          className="border-2 rounded-md shadow-md mb-4 w-[90%] mx-auto"
        >
          <FabricJSCanvas />
        </div>
      </main>

      {/* Properties */}
      {/* TODO: Turn it into component */}
      <div className="border-2 rounded-md p-4 flex flex-col gap-4 items-center">
        <p className="">Properties</p>
        {selectedObjProps && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithLabel
              label="X"
              name="x"
              type="number"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
              value={selectedObjProps.x}
            />
            <InputWithLabel
              label="Y"
              name="y"
              type="number"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
              value={selectedObjProps.y}
            />
            <InputWithLabel
              label="Width"
              name="width"
              type="number"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
              value={selectedObjProps.width}
            />
            <InputWithLabel
              label="Height"
              name="height"
              type="number"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
              value={selectedObjProps.height}
            />
            <InputWithLabel
              label="Color"
              name="fill"
              type="color"
              onChange={(e) => handleInputChange(e, true)}
              onBlur={handleOnBlur}
              value={(selectedObjProps.fill as string) ?? "#000000"}
            />
            <InputWithLabel
              label="Angle"
              name="angle"
              type="number"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
              value={selectedObjProps.angle}
            />
          </div>
        )}
      </div>
    </div>
  );
}
