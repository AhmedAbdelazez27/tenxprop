import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang!: string | null;
  localeEvent = new Subject<string>();

  constructor(private translate: TranslateService) {}

  changeLang(lang: string) {
    this.currentLang = localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY);
    if (this.currentLang !== lang) {
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
      window.location.reload();
    }
    setTimeout(() => {
      this.translate.use(lang);
      this.localeEvent.next(lang);

      let direction = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = direction;
      document.documentElement.lang = lang;

      let getMain = document.getElementsByTagName('html')[0];
      getMain.setAttribute('lang', lang);
      getMain.setAttribute('class', lang);
    }, 1000);
  }
}
