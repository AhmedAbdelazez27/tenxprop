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
  selector: 'app-contract',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule, RouterModule,ToastModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  providers: [WindowProvider,MessageService]
})
export class ServicesComponent implements OnInit {
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
    this.getservices();
  }

  getservices(): void {
    this._SpinnerService.showSpinner();
    const lang = localStorage.getItem('language') || 'en';
    // const hostname = this._window.location.hostname;
    // const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];
    const id = 46;
    this.landingService.getservices({ id, lang }).subscribe({
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
    this.rating = item.rating || 0;
    this.hoveredRating = 0;
    this.feedback = item.feedback || '';
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
      id: this.selectedItem?.id,
      feedback: this.feedback,
      rating: this.rating
    };
  
    this.landingService.updateRequisition(feedbackPayload).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Requisition updated successfully!',
        });
        // this.router.navigate(['/Main/Services']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Request Failed',
          detail: error?.error?.message || 'Could not submit request',
        });
      }
    });
  
    console.log('Submitting Feedback:', feedbackPayload);
    this.closePopup();
  }
  
}
