import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../servicesApi/landing.service';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-check-request',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule, RouterModule,ToastModule],
  templateUrl: './check-request.component.html',
  styleUrl: './check-request.component.scss',
  providers: [WindowProvider,MessageService]
})
export class CheckRequestComponent implements OnInit {
  currentLang: string = 'en';
  serviceList: any[] = [];
  feedback: string = '';

  showPopup: boolean = false;
  selectedItem: any = null;

  rating: number = 0;
  hoveredRating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private translate: TranslateService,
    private landingService: LandingService,
    private messageService: MessageService,

    @Inject(WINDOW) private _window: Window
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
    this.Getcheckdelay();
  }

  Getcheckdelay(): void {
    let userId = null; // تعيين قيمة افتراضية
  
      const userData = localStorage.getItem('userData');
      
      if (userData) {
        try {
          userId = JSON.parse(userData)?.userId;
        } catch (e) {
          console.error('Error parsing userData from localStorage', e);
        }
      }
    this._SpinnerService.showSpinner();
    const lang = localStorage.getItem('language') || 'en';
    // const hostname = this._window.location.hostname;
    // const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];
    const id = 46;
    this.landingService.Getcheckdelay({ id:userId, lang }).subscribe({
      next: (res) => {
        this.serviceList = res.result;
      },
      error: (error) => {
        console.error('Service fetch error:', error);
      },
      complete: () => {
        this._SpinnerService.hideSpinner();
      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'posted': return 'status-green';
      case 'processing': return 'status-yellow';
      case 'new': return 'status-red';
      default: return '';
    }
  }



  closePopup(): void {
    this.showPopup = false;
  }

  routeTo(link:string){
    this.router.navigate([link]);
  }
 
  
}

