import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, RendererFactory2, signal, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _TranslationService = inject(TranslateService);
  private readonly _RendererFactory2 = inject(RendererFactory2).createRenderer(null, null);

  constructor() {
    this._TranslationService.setDefaultLang('en');
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.setLang();
    }

  }
  setLang(): void {
    let savedLang: WritableSignal<string | null> = signal(localStorage.getItem('lang'));
    if (savedLang()) {
      this._TranslationService.use(savedLang()!);
    }
    if (savedLang() === 'en') {
      this._RendererFactory2.setAttribute(document.documentElement, 'dir', 'ltr');
      this._RendererFactory2.setAttribute(document.documentElement, 'lang', 'en');

    } else if (savedLang() === 'ar') {
      this._RendererFactory2.setAttribute(document.documentElement, 'dir', 'rtl')
      this._RendererFactory2.setAttribute(document.documentElement, 'lang', 'ar')
    }
  }
  changeLang(lang: string): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      localStorage.setItem('lang', lang);
      this.setLang()
    }
  }
}
