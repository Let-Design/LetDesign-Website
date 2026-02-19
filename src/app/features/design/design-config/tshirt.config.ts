import { PrintAreaConfig, PrintAreaId, PrintAreaState } from "@models/design.types";
import { initializeGroupClipPath } from "@shared/utils/fabric-utils";
import { Canvas, Rect } from "fabric";

export const TSHIRT_PRINT_AREAS: PrintAreaConfig[] = [
    {
        id: 'front',
        label: 'Front',
        materialName: 'FrontMat',
        template: 'assets/templates/tshirt/frontTemplate.png',
        left: 100,
        top: 0,
        angle: 0,
        scale: 280,
        dpi: 300
    },
    {
        id: 'back',
        label: 'Back',
        materialName: 'BackMat',
        template: 'assets/templates/tshirt/backTemplate.png',
        left: 470,
        top: 0,
        angle: 0,
        scale: 280,
        dpi: 300
    },
    // {
    //     id: 'leftSleeve',
    //     label: "Left Sleeve",
    //     materialName: 'SleeveLMat',
    //     template: 'assets/templates/tshirt/sleeveLTemplate.png',
    //     left: 600,
    //     top: 100,
    //     angle: 0,
    //     scale: 250,
    //     dpi: 300
    // },
    // {
    //     id: 'rightSleeve',
    //     label: 'Right Sleeve',
    //     materialName: 'SleeveRMat',
    //     template: 'assets/templates/tshirt/sleeveRTemplate.png',
    //     left: 600,
    //     top: 100,
    //     angle: 0,
    //     scale: 250,
    //     dpi: 300
    // },
];

export async function initializeTshirtAreas(canvas: Canvas) {
    const areas = new Map<PrintAreaId, PrintAreaState>();
    for (const area of TSHIRT_PRINT_AREAS) {
        const img = await initializeGroupClipPath(
            canvas,
            area.template,
            {
                left: area.left,
                top: area.top,
                angle: area.angle,
                scale: area.scale
            },
            area.id,
        );

        const clip = new Rect({
            left: area.left,
            top: area.top,
            absolutePositioned: true,
        });

        areas.set(area.id, {
            canvas,
            template: img,
            clipPath: clip,
            json: null,
            dirty: false
        });
    }

    return areas;
}