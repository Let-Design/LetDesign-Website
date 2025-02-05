import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ThemeService } from './core/theme/theme.service';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(public themeService: ThemeService) {}
}
