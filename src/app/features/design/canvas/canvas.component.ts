import { AfterViewInit, Component, ElementRef, input, OnDestroy, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { BasicTransformEvent, Canvas, FabricObject, IText, ModifiedEvent, Polyline, TPointerEvent, TPointerEventInfo } from 'fabric';
import { copyObject, getSelectedObjProperties, handleObjectSnap, initializeHorizontalLine, initializeVerticalLine, pasteObject, removeObject } from '@shared/utils/fabric-utils';
import { PrintAreaId, PrintAreaState, ProductType } from '@models/design.types';
import { CanvasService } from '@core/services/canvas/canvas.service';
import { initializeTshirtAreas } from '../design-config/tshirt.config';

@Component({
  selector: 'app-canvas',
  template: `<canvas #canvas></canvas>`,
  encapsulation: ViewEncapsulation.None,
})
export class CanvasComponent implements OnDestroy, AfterViewInit {
  canvas!: Canvas;
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  productType = input.required<ProductType>();
  horizontalLine!: Polyline;
  verticalLine!: Polyline;
  rectCounter = signal(1);
  circleCounter = signal(1);
  activeAreaId = signal<PrintAreaId>('front');
  activeArea = signal<PrintAreaState | undefined>(undefined);
  private resizeObserver?: ResizeObserver;
  private resizeTimeout?: number;

  constructor(private canvasService: CanvasService) { }

  async ngAfterViewInit() {
    this.canvas = new Canvas(this.canvasRef()?.nativeElement);
    await this.getPrintAreaConfig(this.productType());
    this.activeArea.set(this.canvasService.printAreas().get(this.activeAreaId()));
    this.horizontalLine = initializeHorizontalLine(this.canvas);
    this.verticalLine = initializeVerticalLine(this.canvas);

    this.resizeCanvas();
    window.addEventListener('keydown', (e) => this.handleKeyboardShortcut(e));
    this.canvas.on('selection:created', this.handleSelection);
    this.canvas.on('selection:updated', this.handleSelection);
    this.canvas.on('selection:cleared', this.handleSelectionClear);
    this.canvas.on('object:added', this.handleObjectAdded);
    this.canvas.on('object:removed', this.updateCanvasObjects);
    this.canvas.on('object:modified', this.handleObjectModified);
    this.canvas.on('object:scaling', this.handleSelection);
    this.canvas.on('object:rotating', this.handleSelection);
    this.canvas.on('object:skewing', this.handleSelection);
    this.canvas.on('object:resizing', this.handleSelection);
    this.canvas.on('object:moving', this.handleObjSnap);
    this.canvasService.printAreas().forEach(area => area.template.on('mousedblclick', this.switchFunction));
  }

  async getPrintAreaConfig(productType: ProductType) {
    switch (productType) {
      case 'tshirt':
        this.canvasService.printAreas.set(await initializeTshirtAreas(this.canvas));
        break;
      default:
        this.canvasService.printAreas.set(await initializeTshirtAreas(this.canvas));
        break;
    }
  }

  switchFunction = (e: TPointerEventInfo<TPointerEvent> & {
    alreadySelected: boolean;
  }) => {
    this.switchArea(e.target?.name as PrintAreaId);
  }

  switchArea(areaId: PrintAreaId) {
    if (this.activeAreaId() === areaId) return;

    this.activeAreaId.set(areaId);
    this.activeArea.set(this.canvasService.printAreas().get(areaId.split(':')[1] as PrintAreaId));

    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  resizeCanvas = () => {
    const parent = document.getElementById('canvas-container');
    if (!parent) return;

    this.resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;
      this.canvas.renderOnAddRemove = false;
      this.canvas.selection = false;

      window.clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(() => {
        this.canvas.setDimensions({ width: parent.clientWidth, height: parent.clientHeight }, { cssOnly: false })
        this.canvas.renderOnAddRemove = true;
        this.canvas.selection = true;
        this.canvas.requestRenderAll();
      }, 120);
    });

    this.resizeObserver.observe(parent);
  };

  handleKeyboardShortcut = (e: KeyboardEvent) => {
    if (e.key === 'Backspace' && document.activeElement?.tagName !== 'INPUT') {
      removeObject(this.canvas);
    } else if (e.ctrlKey && e.key === 'c') {
      copyObject(this.canvas);
    } else if (e.ctrlKey && e.key === 'v') {
      pasteObject(this.canvas);
    }
  };

  handleObjectAdded = (e: { target: FabricObject }) => {
    const obj = e.target;
    if (obj) {
      if (obj.type === 'rect') {
        obj.set('name', `Rect ${this.rectCounter()}`);
        this.rectCounter.update((value) => value + 1);
      } else if (obj.type === 'circle') {
        obj.set('name', `Circle ${this.circleCounter()}`);
        this.circleCounter.update((value) => value + 1);
      } else if (obj.type === 'i-text') {
        obj.set('name', (obj as IText).text);
      } else if (obj.type === 'image') {
        obj.set('name', obj.name);
      }
      this.updateCanvasObjects();
    }
  };

  updateCanvasObjects = () => {
    const canvasObjects: FabricObject[] = [];
    this.canvas.getObjects().forEach((obj) => {
      if (
        obj.type === 'rect' ||
        obj.type === 'circle' ||
        obj.type === 'i-text' ||
        (obj.type === 'image' && !obj.name?.includes('canvasTemplate'))
      ) {
        canvasObjects.push(obj);
      }
    });
    this.canvasService.setObjects(canvasObjects);
  };

  handleObjectModified = (e: ModifiedEvent<TPointerEvent>) => {
    const obj = e.target;
    if (obj && obj.type === 'i-text') {
      obj.set('name', (obj as IText).text);
    }
    this.updateCanvasObjects();

    if (this.canvas.getObjects().includes(this.horizontalLine)) {
      this.canvas.remove(this.horizontalLine);
    }
    if (this.canvas.getObjects().includes(this.verticalLine)) {
      this.canvas.remove(this.verticalLine);
    }
  };

  handleSelection = () => {
    const properties = getSelectedObjProperties(this.canvas);
    this.canvasService.setObjectProps(properties);
  };

  handleObjSnap = (e: BasicTransformEvent<TPointerEvent> & { target: FabricObject }) => {
    this.handleSelection();
    handleObjectSnap(e, this.canvas, this.canvasService.printAreas(), this.horizontalLine, this.verticalLine);
  };

  handleSelectionClear = () => {
    this.canvasService.setObjectProps(null);
  };

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    window.removeEventListener('keydown', this.handleKeyboardShortcut);
    this.canvas.off('selection:created', this.handleSelection);
    this.canvas.off('selection:updated', this.handleSelection);
    this.canvas.off('selection:cleared', this.handleSelectionClear);
    this.canvas.off('object:added', this.handleObjectAdded);
    this.canvas.off('object:removed', this.updateCanvasObjects);
    this.canvas.off('object:modified', this.handleObjectModified);
    this.canvas.off('object:scaling', this.handleSelection);
    this.canvas.off('object:rotating', this.handleSelection);
    this.canvas.off('object:skewing', this.handleSelection);
    this.canvas.off('object:resizing', this.handleSelection);
    this.canvas.off('object:moving', this.handleObjSnap);
    this.canvasService.printAreas().forEach(area => area.template.off('mousedblclick', this.switchFunction));

    this.canvas.dispose();
  }
}