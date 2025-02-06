import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  InitialProfile,
  LoginInput,
  RegisterInput,
  UserProfile,
} from '../../types/auth.types';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BaseService } from './base.service';

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
export class AuthService extends BaseService {
  user = signal<UserProfile>(InitialProfile);
  isAuthenticated = signal(!!localStorage.getItem('auth'));

  constructor(
    protected override http: HttpClient,
    private oAuthService: OAuthService
  ) {
    super(http);
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        localStorage.setItem('auth', 'true');
        const profile = this.oAuthService.getIdentityClaims();
        this.user.set({
          name: profile['name'],
          email: profile['email'],
          picture: profile['picture'],
        });
        this.isAuthenticated.set(true);
      }
    });
  }

  login(input: LoginInput) {
    return this.post(`${this.BACKEND_URL}/auth/login`, input);
  }

  register(input: RegisterInput) {
    return this.post(`${this.BACKEND_URL}/auth/register`, input);
  }

  logout() {
    return this.post(`${this.BACKEND_URL}/auth/logout`, '');
  }

  hasValidAccessToken() {
    return this.oAuthService.hasValidAccessToken();
  }

  loginWithGoogle() {
    this.oAuthService.initImplicitFlow();
  }

  logoutWithGoogle() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    localStorage.removeItem('auth');
    this.user.set(InitialProfile);
    this.isAuthenticated.set(false);
  }

  getUserProfile() {
    if (!this.oAuthService.hasValidAccessToken()) return;
    return this.oAuthService.getIdentityClaims();
  }
}
