import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// primeng modules
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../services/auth.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../services/cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../services/translation.service';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [ CommonModule,CarouselModule,RouterModule,ToastModule,TranslateModule],
  providers:[AuthService,MessageService],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{


  routes = [
    { path: '/Main/Home', name: 'Home' },
    { path: '/Main/Services', name: 'Services' },
    { path: '/Main/Emergency', name: 'Emergency' },
  ];
  cartCount: number=0;
  currentLanguage: string;
  userName: string | null = null; 
  constructor(private router: Router,private cartService: CartService,private messageService : MessageService,private translationService: TranslationService) {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.cartCount = JSON.parse(localStorage.getItem('items')||'[]')?.length ;
  }
  ngOnInit(): void {
    this.cartService.cartCount$.subscribe((count) => {
      console.log(count);
      this.cartCount = count;
    });
    this.cartService.userData$.subscribe((userData) => {
      if(userData) {
        this.userName = userData.userName;
      } else {
        this.userName = null;
      }
    });
    
  }
  logout() {
    localStorage.removeItem('userData');  
    sessionStorage.removeItem('userData'); 
    this.cartService.setUserName(undefined);
  }
  navigate(route: any): void {
    this.router.navigate([route]);
  }
  switchLanguage(lang: string) {
    this.translationService.changeLang(lang); // Call the translation service to change language
    this.currentLanguage = lang; // Update current language to reflect in the dropdown
  }
}
