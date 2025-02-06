import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TuiButton,
  TuiDropdown,
  TuiFallbackSrcPipe,
  TuiIcon,
} from '@taiga-ui/core';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { TuiAvatar, TuiAvatarOutline } from '@taiga-ui/kit';
import { TuiActiveZone } from '@taiga-ui/cdk/directives/active-zone';
import { TuiObscured } from '@taiga-ui/cdk/directives/obscured';
import { AsyncPipe } from '@angular/common';
import { InitialProfile, UserProfile } from '../../types/auth.types';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    AsyncPipe,
    TuiButton,
    TuiActiveZone,
    TuiDropdown,
    TuiObscured,
    TuiFallbackSrcPipe,
    TuiIcon,
    TuiAvatar,
    TuiAvatarOutline,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  userProfile = signal<UserProfile>(InitialProfile);
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  protected open = false;

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      this.userProfile.set(this.authService.user());
      this.cdr.detectChanges();
    });
  }

  protected onClick(): void {
    this.open = !this.open;
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  protected onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }

  logout() {
    if (this.authService.hasValidAccessToken()) {
      this.authService.logoutWithGoogle();
    } else {
      this.authService.logout().subscribe((res) => {
        console.log(res);
        this.authService.isAuthenticated.set(false);
        localStorage.removeItem('auth');
      });
    }
  }
}
