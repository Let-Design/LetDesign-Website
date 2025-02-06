import { Routes } from '@angular/router';
import { AboutComponent } from './features/about/about.component';
import { DesignComponent } from './features/design/design.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth/auth.guard';
import { PageNotFoundComponent } from './shared/ui/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'design', component: DesignComponent },
  {
    path: 'auth',
    canActivate: [authGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
