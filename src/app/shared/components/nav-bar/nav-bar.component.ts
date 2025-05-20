import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
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
import { LandingService } from '../../../components/dashboard/main/servicesApi/landing.service';
import { WindowProvider,WINDOW } from '../../Providers/window-provider.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [ CommonModule,CarouselModule,RouterModule,ToastModule,TranslateModule],
  providers:[AuthService,MessageService,WindowProvider],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit{
  logopath: any[]=[];
  currentLanguage: string;
  userData:any;
  constructor(private router: Router,private cartService: CartService,private messageService : MessageService,
      private landingService: LandingService,
    @Inject(WINDOW) private _window: Window ,// ✅ FIXED injection
      
       private translationService: TranslationService) {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    let data = localStorage.getItem("userData")
    this.userData=data? JSON.parse(data):{};
  }
  ngOnInit(): void {
        this.getlogo();
  }
logoPath: string = '';


getlogo() {
let hostname = this._window.location.hostname;
let tenancyName: string;

if (hostname.includes('localhost')) {
  tenancyName = 'compassint';
} else {
  tenancyName = hostname.split('.')[0];
}
  this.landingService.getlogo({ tenancyName }).subscribe({
    next: (res) => {
      this.logoPath = res.result?.tenantFilePath || '';
    },
    error: (err) => {
      console.error('Failed to load logo:', err);
    }
  });
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
