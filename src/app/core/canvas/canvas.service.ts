import { Injectable, signal } from '@angular/core';
import { FabricObject } from 'fabric';
import { SelectedObjectProperty } from '../../types/editor.types';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  objects = signal<FabricObject[]>([]);
  selectedObjProps = signal<SelectedObjectProperty | null>(null);

  setObjects(newValue: FabricObject[]) {
    this.objects.set(newValue);
  }

  setObjectProps(newValue: SelectedObjectProperty) {
    this.selectedObjProps.set(newValue);
  }
}
