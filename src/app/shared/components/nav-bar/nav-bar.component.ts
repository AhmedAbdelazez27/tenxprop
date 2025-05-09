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

  currentLanguage: string;
  userData:any;
  constructor(private router: Router,private cartService: CartService,private messageService : MessageService,private translationService: TranslationService) {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    let data = localStorage.getItem("userData")
    this.userData=data? JSON.parse(data):{};
  }
  ngOnInit(): void {
    
  }
  logout() {
    localStorage.removeItem('userData');  
    localStorage.removeItem('token'); 
    this.router.navigate(['/Auth/Login'])
  }
  navigate(route: any): void {
    this.router.navigate([route]);
  }
  switchLanguage(lang: string) {
    this.translationService.changeLang(lang); // Call the translation service to change language
    this.currentLanguage = lang; // Update current language to reflect in the dropdown
  }
}
