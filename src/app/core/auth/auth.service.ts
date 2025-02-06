import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoginInput, RegisterInput, UserProfile } from '../../types/auth.types';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: 'http://localhost:4200',
  clientId:
    '276790002319-nekluqvigbh1bhmip97pfrel6vqk3h0b.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected BACKEND_URL = 'http://localhost:8080/api/auth';
  user = signal<UserProfile | null>(null);

  constructor(private http: HttpClient, private oAuthService: OAuthService) {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        const profile = this.oAuthService.getIdentityClaims();
        this.user.set({
          name: profile['name'],
          email: profile['email'],
          picture: profile['picture'],
        });
      }
    });
  }

  login(input: LoginInput) {
    return this.http.post(`${this.BACKEND_URL}/login`, input).pipe(
      catchError((error) => {
        console.error('Login failed: ', error);
        return throwError(() => error);
      })
    );
  }

  register(input: RegisterInput) {
    return this.http.post(`${this.BACKEND_URL}/register`, input).pipe(
      catchError((error) => {
        console.error('Register failed: ', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    return this.http.post(`${this.BACKEND_URL}/logout`, '').pipe(
      catchError((error) => {
        console.error('Logout failed: ', error);
        return throwError(() => error);
      })
    );
  }

  loginWithGoogle() {
    this.oAuthService.initImplicitFlow();
  }

  logoutWithGoogle() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.user.set(null);
  }

  getUserProfile() {
    if (!this.oAuthService.hasValidAccessToken()) return;
    return this.oAuthService.getIdentityClaims();
  }

  getUserProfileAlt() {
    if (!this.oAuthService.hasValidAccessToken()) {
      console.warn("Don't have access token");
      return Promise.reject('User not logged in');
    }
    return this.oAuthService.loadUserProfile();
  }
}
