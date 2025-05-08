import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../servicesApi/landing.service';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  providers: [WindowProvider]
})
export class ServicesComponent implements OnInit {
  currentLang: string = 'en';
  serviceList: any[] = [];
  feedbackText: string = '';

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
    @Inject(WINDOW) private _window: Window
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
    this.getservices();
  }

  getservices(): void {
    this._SpinnerService.showSpinner();
    const lang = localStorage.getItem('language') || 'en';
    const hostname = this._window.location.hostname;
    const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];

    this.landingService.getservices({ tenancyName, lang }).subscribe({
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
      case 'closed': return 'status-green';
      case 'processing': return 'status-yellow';
      case 'new': return 'status-red';
      default: return '';
    }
  }

  openPopup(item: any): void {
    this.selectedItem = item;
    this.showPopup = true;
    this.rating = 0;
    this.hoveredRating = 0;
    this.feedbackText = '';
  }

  closePopup(): void {
    this.showPopup = false;
  }

  setRating(value: number): void {
    this.rating = value;
  }

  hoverRating(value: number): void {
    this.hoveredRating = value;
  }
  routeTo(link:string){
    this.router.navigate([link]);
  }
  submitFeedback(): void {
    const feedbackPayload = {
      unitId: this.selectedItem?.unitId,
      rating: this.rating,
      comments: this.feedbackText
    };

    console.log('Submitting Feedback:', feedbackPayload);

    this.closePopup();
  }
}
