import { Component, computed, ElementRef, HostListener, OnDestroy, signal, viewChild } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { addCircle, addImage, addRectangle, addText, getSelectedObjProperties, saveCanvas, toggleDrawMode, updateSelectedObjProperties } from '@shared/utils/fabric-utils';
import { TuiInputColor, tuiInputColorOptionsProvider, TuiTabs } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { SelectedObjectProperty } from '@models/editor.types';
import { FormsModule } from '@angular/forms';
import { CanvasService } from '@core/services/canvas/canvas.service';
import { FabricObject } from 'fabric';

@Component({
  selector: 'app-design',
  imports: [CommonModule, FormsModule, CanvasComponent, TuiTabs, TuiButton, TuiTextfield],
  templateUrl: './design.component.html',
  providers: [tuiInputColorOptionsProvider({ format: 'hexa' })],
})
export class DesignComponent implements OnDestroy {
  canvasRef = viewChild(CanvasComponent);
  inputRef = viewChild<ElementRef<HTMLInputElement>>('fileUpload');
  drawMode = signal(false);
  viewType = signal('2D');
  activeItemIndex = 0;

  // palette = TUI_DEFAULT_INPUT_COLORS;
  objects = computed(() => this.canvasService.objects());
  selectedObjProps = computed(() => this.canvasService.selectedObjProps());

  constructor(private canvasService: CanvasService) {
    this.canvasService.objects.set([]);
  }

  ngOnDestroy(): void {
    this.canvasService.objects.set([]);
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyboardShortcut(e: KeyboardEvent) {
    if (e.key.toLowerCase() === "v") this.toggleViewMode();
  }

  handleRectangleAdd() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addRectangle(fabricCanvas.canvas);
  }

  handleCircleAdd() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addCircle(fabricCanvas.canvas);
  }

  handleTextAdd() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addText(fabricCanvas.canvas);
  }

  onFileChanged(event: Event) {
    const fabricCanvas = this.canvasRef();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && fabricCanvas) {
      const uploadedImg = URL.createObjectURL(file);
      addImage(fabricCanvas.canvas, uploadedImg, file.name);
    }
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
    const content = saveCanvas(fabricCanvas.canvas);
    console.log(content);
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

    if (name === 'fill') this.handlePropsUpdate();
  };

  handleSelectChange = (e: any) => {
    const { name, value } = e.target;

    this.canvasService.selectedObjProps.update((oldValue) => {
      return {
        ...oldValue,
        [name]: value,
      } as SelectedObjectProperty;
    });

    this.handlePropsUpdate();
  };

  handlePropsUpdate = () => {
    const fabricCanvas = this.canvasRef();
    const selectedProps = this.selectedObjProps();

    if (selectedProps && fabricCanvas) {
      updateSelectedObjProperties(fabricCanvas.canvas, selectedProps);
      const properties = getSelectedObjProperties(fabricCanvas.canvas);
      this.canvasService.setObjectProps(properties);
    }
  };

  handleEnterPressed(e: KeyboardEvent) {
    if (e.key === "Enter") this.handlePropsUpdate();
  }
}
