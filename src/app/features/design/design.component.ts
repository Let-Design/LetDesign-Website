import { Component, computed, ElementRef, HostListener, OnDestroy, signal, viewChild } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { addCircle, addImage, addRectangle, addText, bringObjectForward, getSelectedObjProperties, saveCanvas, sendObjectBackward, toggleDrawMode, updateSelectedObjProperties } from '@shared/utils/fabric-utils';
import { TuiInputColor, tuiInputColorOptionsProvider, TuiTabs } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { isRectangleProps, SelectedObjectProperty } from '@models/editor.types';
import { FormsModule } from '@angular/forms';
import { CanvasService } from '@core/services/canvas/canvas.service';
import { FabricObject, StaticCanvas } from 'fabric';
import { PrintAreaId, ProductType } from '@models/design.types';
import { ViewerComponent } from './viewer/viewer.component';
import { CanvasTexture } from 'three';

@Component({
  selector: 'app-design',
  imports: [
    CommonModule, FormsModule, CanvasComponent, ViewerComponent,
    TuiTabs, TuiButton, TuiIcon, TuiInputColor, TuiTextfield
  ],
  templateUrl: './design.component.html',
  providers: [tuiInputColorOptionsProvider({ format: 'hexa' })],
})
export class DesignComponent implements OnDestroy {
  canvasRef = viewChild(CanvasComponent);
  inputRef = viewChild<ElementRef<HTMLInputElement>>('fileUpload');
  drawMode = signal(false);
  viewType = signal('2D');
  listCollapse = signal(false);
  activeAreaId = signal<PrintAreaId>('front');
  activeProductType: ProductType = 'tshirt';

  objects = computed(() => this.canvasService.objects());
  selectedObjProps = computed(() => this.canvasService.selectedObjProps());
  rectangleProps = computed(() => {
    const props = this.canvasService.selectedObjProps();
    return isRectangleProps(props) ? props : null;
  });

  constructor(private canvasService: CanvasService) {
    this.canvasService.objects.set([]);
  }

  ngOnDestroy(): void {
    this.canvasService.objects.set([]);
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyboardShortcut(e: KeyboardEvent) {
    const target = e.target as HTMLElement;

    if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

    if (!e.ctrlKey && e.key.toLowerCase() === "v") {
      e.preventDefault();
      this.toggleViewMode();
    }
  }

  setAreaId(areaId: string) {
    this.activeAreaId.set(areaId as PrintAreaId);
    this.canvasRef()?.switchArea(areaId as PrintAreaId);
  }

  handleRectangleAdd() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addRectangle(fabricCanvas.canvas, fabricCanvas.activeArea());
  }

  handleCircleAdd() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addCircle(fabricCanvas.canvas, fabricCanvas.activeArea());
  }

  handleTextAdd() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    addText(fabricCanvas.canvas, fabricCanvas.activeArea());
  }

  onFileChanged(event: Event) {
    const fabricCanvas = this.canvasRef();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && fabricCanvas) {
      const uploadedImg = URL.createObjectURL(file);
      addImage(fabricCanvas.canvas, uploadedImg, file.name, fabricCanvas.activeArea());
    }
  }

  toggleDrawMode() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    this.drawMode.update((value) => !value);
    toggleDrawMode(fabricCanvas.canvas);
  }

  bringForward() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    bringObjectForward(fabricCanvas.canvas);
  }

  sendBackward() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;
    sendObjectBackward(fabricCanvas.canvas);
  }

  @HostListener('window:keypress', ['$event'])
  collapseListContent(e: KeyboardEvent) {
    if (e.key === "`") {
      this.listCollapse.set(!this.listCollapse());
      this.canvasRef()?.resizeCanvas();
    }
  }

  async toggleViewMode() {
    if (this.viewType() === '2D') {
      await this.saveTextureData();
    }

    this.viewType.update((value) => (value === '2D' ? '3D' : '2D'));
  }

  async saveTextureData() {
    const fabricCanvas = this.canvasRef();
    if (!fabricCanvas) return;

    const data = fabricCanvas.canvas.toJSON();
    const tasks: Promise<void>[] = [];

    for (const key of this.canvasService.printAreas().keys()) {
      const templateName = `canvasTemplate:${key}`
      const objects = data.objects ?? [];
      const json = (objects as Array<any>).filter(obj => obj.printAreaId === templateName);
      const printArea = this.canvasService.printAreas().get(key);

      if (!printArea) continue;
      printArea.json = json;
      // console.log(`Object by ${key}: `, json);

      // Converting the json to THREE texture
      tasks.push((async () => {
        try {
          const tempCanvas = new StaticCanvas(undefined, { width: 1024, height: 1024 });

          await tempCanvas.loadFromJSON(json);
          tempCanvas.renderAll();

          const texture = new CanvasTexture(tempCanvas.getElement());
          texture.needsUpdate = true;

          printArea.texture = texture;
          tempCanvas.dispose();
        } catch (err) {
          console.error("Texture failed to generate: ", key, err);
        }
      })());
    }

    await Promise.all(tasks);
    // console.log(`Print areas: `, this.canvasService.printAreas());
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

  handleSelectChange(e: any) {
    const { name, value } = e.target;

    this.canvasService.selectedObjProps.update((oldValue) => {
      return {
        ...oldValue,
        [name]: value,
      } as SelectedObjectProperty;
    });

    this.handlePropsUpdate();
  };

  handlePropsUpdate() {
    const fabricCanvas = this.canvasRef();
    const selectedProps = this.selectedObjProps();

    if (selectedProps && fabricCanvas) {
      updateSelectedObjProperties(fabricCanvas.canvas, selectedProps);
      const properties = getSelectedObjProperties(fabricCanvas.canvas);
      this.canvasService.setObjectProps(properties);
    }
  }

  handleEnterPressed(e: KeyboardEvent) {
    if (e.key === "Enter") this.handlePropsUpdate();
  }
}
