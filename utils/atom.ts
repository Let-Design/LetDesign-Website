import { SelectedObjectProperty } from "@/types/editor.types";
import { Canvas, FabricObject } from "fabric";
import { atom } from "jotai";

export const isLightMode = atom(true);

export const canvasAtom = atom<Canvas>();
export const selectedObjectAtom = atom<FabricObject>();
export const selectedObjPropsAtom = atom<SelectedObjectProperty>();
export const canvasObjectsAtom = atom<FabricObject[]>();