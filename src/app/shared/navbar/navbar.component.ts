import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TuiIcon],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(public themeService: ThemeService) {}
}
