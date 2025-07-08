import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  BasicTransformEvent,
  Canvas,
  FabricImage,
  FabricObject,
  IText,
  Line,
  ModifiedEvent,
  TPointerEvent,
} from 'fabric';
import {
  copyObject,
  getSelectedObjProperties,
  handleObjectSnap,
  initializeHorizontalLine,
  initializeVerticalLine,
  pasteObject,
  removeObject,
} from '@shared/utils/fabric-utils';
import { CanvasService } from '@core/services/canvas.service';

@Component({
  selector: 'app-canvas',
  template: `<canvas #canvas></canvas>`,
  encapsulation: ViewEncapsulation.None,
})
export class CanvasComponent implements OnDestroy, AfterViewInit {
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  canvas!: Canvas;
  horizontalLine!: Line;
  verticalLine!: Line;
  rectCounter = signal(1);
  circleCounter = signal(1);

  constructor(private canvasService: CanvasService) {}

  ngAfterViewInit(): void {
    this.canvas = new Canvas(this.canvasRef()?.nativeElement);
    this.horizontalLine = initializeHorizontalLine(this.canvas);
    this.verticalLine = initializeVerticalLine(this.canvas);
    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());
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
  }

  resizeCanvas = () => {
    const parent = document.getElementById('canvas-container');
    if (parent) {
      this.canvas.setWidth(parent.clientWidth);
      this.canvas.setHeight(parent.clientHeight);
      this.canvas.requestRenderAll();
    }
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
      }
      this.updateCanvasObjects();
    }
  };

  updateCanvasObjects = () => {
    const canvasObjects: FabricObject[] = [];
    this.canvas.getObjects().forEach((obj) => {
      const imgObj = obj as FabricImage;
      if (
        obj.type === 'rect' ||
        obj.type === 'circle' ||
        obj.type === 'i-text' ||
        (obj.type === 'image' &&
          obj.name !== 'canvasTemplate' &&
          !imgObj.getSrc().includes('shirtTemplateFront') &&
          !imgObj.getSrc().includes('shirtTemplateBack'))
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
  };

  handleSelection = () => {
    const properties = getSelectedObjProperties(this.canvas);
    this.canvasService.setObjectProps(properties);
  };

  handleObjSnap = (
    e: BasicTransformEvent<TPointerEvent> & {
      target: FabricObject;
    }
  ) => {
    this.handleSelection();
    handleObjectSnap(e, this.canvas, this.horizontalLine, this.verticalLine);
  };

  handleSelectionClear = () => {
    this.canvasService.setObjectProps(null);
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeCanvas);
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

    this.canvas.dispose();
  }
}
