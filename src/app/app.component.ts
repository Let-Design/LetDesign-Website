import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { ThemeService } from './core/services/theme/theme.service';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(public themeService: ThemeService) { }
}
