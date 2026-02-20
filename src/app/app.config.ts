import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideNgtRenderer } from "angular-three/dom";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideOAuthClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgtRenderer()
  ],
};
