import { computed, Injectable, signal } from '@angular/core';

export enum PageTheme {
  LIGHT,
  NIGHT,
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = signal<PageTheme>(
    localStorage.getItem('theme') === 'dark' ? PageTheme.NIGHT : PageTheme.LIGHT
  );
  isLight = computed(() => this.theme() === PageTheme.LIGHT);

  constructor() {
    this.applyTheme();
  }

  toggleTheme() {
    this.theme.update((value) => {
      const newTheme =
        value === PageTheme.LIGHT ? PageTheme.NIGHT : PageTheme.LIGHT;
      localStorage.setItem(
        'theme',
        newTheme === PageTheme.LIGHT ? 'light' : 'dark'
      );
      this.applyTheme();
      return newTheme;
    });
  }

  private applyTheme() {
    document.documentElement.setAttribute(
      'data-theme',
      this.isLight() ? 'light' : 'dark'
    );
  }

  getTheme() {
    return this.theme;
  }
}
