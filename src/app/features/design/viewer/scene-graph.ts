import { CUSTOM_ELEMENTS_SCHEMA, Component, ChangeDetectionStrategy, signal, OnDestroy } from '@angular/core';
import { injectStore, loaderResource, NgtArgs } from 'angular-three';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { GLTFLoader, OrbitControls } from 'three-stdlib';
import { extend } from 'angular-three';
import { CanvasService } from '@core/services/canvas/canvas.service';

@Component({
  selector: 'app-scene-graph',
  imports: [NgtArgs],
  template: `
    <ngt-ambient-light [intensity]="0.5" />
    <ngt-spot-light
      [position]="[4, 10, 4]"
      [intensity]="0.8 * Math.PI"
      [angle]="0.5"
      [penumbra]="1"
      [decay]="0"
    />
    <ngt-point-light [position]="-10" [intensity]="0.5 * Math.PI" [decay]="0" />
    <ngt-orbit-controls *args="[camera(), glDom()]" [enableZoom]="false" />
    @if (model.value(); as gltf) {
      <ngt-group (pointerover)="setCursor('grab')" (pointerout)="setCursor('default')">
        <ngt-primitive 
          *args="[gltf.scene]" 
          [position]="[-0.38, -0.3, 0]" 
          [rotation]="[-0.25, 0, -0.15]" 
        />
      </ngt-group>
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneGraph implements OnDestroy {
  protected readonly Math = Math;
  model = loaderResource(() => GLTFLoader, () => "t_shirt_mod.glb");
  ngtStore = injectStore();
  hovered = signal(false);
  camera = this.ngtStore.camera;
  scene = this.ngtStore.scene;
  glDom = this.ngtStore.gl.domElement;

  constructor(private canvasService: CanvasService) {
    extend({ Mesh, BoxGeometry, MeshBasicMaterial, OrbitControls });
    console.log("Print areas in scene graph: ", this.canvasService.printAreas());
  }

  ngOnDestroy(): void {
    this.scene().traverse((obj: any) => {
      if (obj.geometry) obj.geometry.dispose();

      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m: any) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    this.model.destroy();
  }

  setCursor(type: 'grab' | 'default' | 'grabbing') {
    document.body.style.cursor = type;
  }
}