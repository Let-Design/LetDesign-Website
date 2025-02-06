import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import {
  addCircle,
  addRectangle,
  addText,
  getSelectedObjProperties,
  saveCanvas,
  toggleDrawMode,
  updateSelectedObjProperties,
} from '../../utils/fabricUtils';
import { TuiTabs } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { SelectedObjectProperty } from '../../types/editor.types';
import {
  TUI_DEFAULT_INPUT_COLORS,
  TuiInputColorModule,
} from '@taiga-ui/legacy';
import { FormsModule } from '@angular/forms';
import { CanvasService } from '../../core/canvas/canvas.service';
import { FabricObject } from 'fabric';

@Component({
  selector: 'app-design',
  imports: [
    CommonModule,
    FormsModule,
    CanvasComponent,
    TuiTabs,
    TuiInputColorModule,
    TuiButton,
    TuiTextfield,
  ],
  templateUrl: './design.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignComponent implements OnDestroy {
  canvasRef = viewChild(CanvasComponent);
  activeItemIndex = 0;
  drawMode = signal(false);
  viewType = signal('2D');

  palette = TUI_DEFAULT_INPUT_COLORS;
  objects = computed(() => this.canvasService.objects());
  selectedObjProps = computed(() => this.canvasService.selectedObjProps());

  constructor(private canvasService: CanvasService) {}

  ngOnDestroy(): void {
    this.canvasService.objects.set([]);
  }

  addRectangle() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addRectangle(fabricCanvas.canvas);
  }

  addCircle() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addCircle(fabricCanvas.canvas);
  }

  addText() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addText(fabricCanvas.canvas);
  }

  toggleDrawMode() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    this.drawMode.update((value) => !value);
    toggleDrawMode(fabricCanvas.canvas);
  }

  toggleViewMode() {
    this.viewType.update((value) => (value === '2D' ? '3D' : '2D'));
  }

  saveCanvas() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    saveCanvas(fabricCanvas.canvas);
  }

  setActiveObj(obj: FabricObject) {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    fabricCanvas.canvas.setActiveObject(obj);
    fabricCanvas.canvas.requestRenderAll();
  }

  handleInputChange = (e: Event, acceptString: boolean = false) => {
    const inputElement = e.target as HTMLInputElement;
    const { name, value } = inputElement;

    this.canvasService.selectedObjProps.update((oldValue) => {
      return {
        ...oldValue,
        [name]: acceptString ? value : Number(value),
      } as SelectedObjectProperty;
    });

    if (name === 'fill') {
      this.handleOnBlur();
    }
  };

  handleSelectChange = (e: any) => {
    const { name, value } = e.target;

    this.canvasService.selectedObjProps.update((oldValue) => {
      return {
        ...oldValue,
        [name]: value,
      } as SelectedObjectProperty;
    });

    this.handleOnBlur();
  };

  handleOnBlur = () => {
    const fabricCanvas = this.canvasRef();
    const selectedProps = this.selectedObjProps();
    if (selectedProps && fabricCanvas) {
      updateSelectedObjProperties(fabricCanvas.canvas, selectedProps);
      const properties = getSelectedObjProperties(fabricCanvas.canvas);
      this.canvasService.setObjectProps(properties);
    }
  };
}
