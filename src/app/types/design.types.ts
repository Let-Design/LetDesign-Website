import { Canvas, FabricImage, Point, Rect } from "fabric";
import { CanvasTexture } from "three";

export type ProductType = 'tshirt' | 'longSleeve';
export type PrintAreaId = 'front' | 'back' | 'leftSleeve' | 'rightSleeve';
export interface PrintAreaConfig {
    id: PrintAreaId;
    label: string;
    left: number;
    top: number;
    angle: number;
    scale: number;
    materialName: string;
    template: string;
    dpi: number;
}

export interface PrintAreaState {
    canvas: Canvas;
    json: any;
    clipPath: Rect;
    template: FabricImage;
    texture?: CanvasTexture;
    dirty: false;
}

export interface ProductDesign {
    productType: ProductType;
    areas: Record<PrintAreaId, { canvasJson: any, canvasImg: any }>;
}

export interface ClosestPoint {
    id: PrintAreaId,
    center: Point,
    template: FabricImage,
}