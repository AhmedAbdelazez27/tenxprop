import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CartService } from './shared/services/cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,NgxSpinnerModule,TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private cartService: CartService,
    private translate: TranslateService
  ){
    this.initLanguage();
  }
  ngOnInit(): void {
    this.addItemToCart();
    const userData = localStorage.getItem('userData');
    const parsedItem = userData ? JSON.parse(userData) : {};
    this.cartService.setUserName(parsedItem); 
  }

  private initLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.translate.use(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      // this.loadStyleFile(savedLang);
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      localStorage.setItem('language', 'en');
      // this.loadStyleFile('en');
    }
  }



  addItemToCart(): void {
    const item = localStorage.getItem('items');
    const parsedItem = item ? JSON.parse(item) : [];
    this.cartService.addToCart(parsedItem);
  };

  // private loadStyleFile(lang: string): void {
  //   const head = document.getElementsByTagName('head')[0];
  //   let existingLink = document.getElementById('dynamic-style') as HTMLLinkElement;

  //   if (existingLink) {
  //     head.removeChild(existingLink); // Remove existing style file
  //   }

  //   const link = document.createElement('link');
  //   link.id = 'dynamic-style';
  //   link.rel = 'stylesheet';
  //   link.href = lang === 'ar' ? 'assets/style/rtl.scss' : 'assets/style/ltr.scss'; // Path to your CSS files
  //   head.appendChild(link);
  // }
}
