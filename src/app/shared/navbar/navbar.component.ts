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
import { ThemeService } from '../../core/theme/theme.service';
import { AuthService } from '../../core/auth/auth.service';
import { TuiAvatar, TuiAvatarOutline } from '@taiga-ui/kit';
import { TuiActiveZone } from '@taiga-ui/cdk/directives/active-zone';
import { TuiObscured } from '@taiga-ui/cdk/directives/obscured';
import { AsyncPipe } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserProfile } from '../../types/auth.types';

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
  userProfile = signal<UserProfile | null>({
    name: '',
    email: '',
    picture: '',
  });
  isAuthenticated = signal(false);
  protected open = false;

  constructor(
    public themeService: ThemeService,
    private oAuthService: OAuthService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      this.isAuthenticated.set(this.oAuthService.hasValidIdToken());
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
    if (this.oAuthService.hasValidAccessToken()) {
      this.authService.logoutWithGoogle();
    } else {
      this.authService.logout();
    }
  }
}
