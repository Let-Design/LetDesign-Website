import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgtCanvas } from 'angular-three/dom';
import { SceneGraph } from './scene-graph';

@Component({
  selector: 'app-viewer',
  imports: [NgtCanvas, SceneGraph],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewerComponent {
}
