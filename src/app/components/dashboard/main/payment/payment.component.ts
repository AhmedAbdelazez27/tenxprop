import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { LandingService } from '../servicesApi/landing.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  providers: [WindowProvider, MessageService]
})
export class PaymentComponent implements OnInit {
  contractsList: any[] = [];
  selectedContract: any;  // Selected contract object for request
  reason: string = '';
  proposedDate: any;  // Proposed date for delay
  attachment: File | null = null;  // Optional attachment
  attachmentName: string = '';
  userId: any;

  constructor(
    public router: Router,
    private _SpinnerService: SpinnerService,
    private translate: TranslateService,
    private landingService: LandingService,
    private messageService: MessageService,
   @Inject(WINDOW) private _window: Window

  ) {

  }
  ngOnInit(): void {
    this.getPayments();
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Renew':
        return 'status-renew';
      case 'Expired':
        return 'status-expired';
      case 'Canceled':
        return 'status-canceled';
      case 'New':
        return 'status-new';
      case 'received':
        return 'status-received';
      default:
        return ''; // Default case, no class applied
    }
  }

  getPayments() {
    let userId = null; // تعيين قيمة افتراضية

    const userData = localStorage.getItem('userData');

    if (userData) {
      try {
        userId = JSON.parse(userData)?.userId;
        this.userId = userId;
      } catch (e) {
        console.error('Error parsing userData from localStorage', e);
      }
    }


    this._SpinnerService.showSpinner();
    this.landingService.getPayments({ Id: userId }).subscribe({
      next: (res) => {
        console.log(res);
        this._SpinnerService.hideSpinner();
        this.contractsList = res.result?.items;
      },
      error: (error) => {
        this._SpinnerService.hideSpinner();

      },
      complete: () => {
        this._SpinnerService.hideSpinner();
      }
    })
  };

  setPayment(item: any) {
    debugger
    this.selectedContract = { ...item }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;  // Type assertion
    if (input && input.files) {
      this.attachment = input.files[0];
      this.attachmentName = input.files[0].name;
    }
  }
  submitedForm: boolean = false;
  requestChequeDelay() {
    debugger
  const hostname = this._window.location.hostname;
    const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];



    if (!this.proposedDate || !this.reason) {
      this.submitedForm = true;
      // Handle the case where the form is invalid
      return;
    }
    let requestBody = {
      pmContractId: this.selectedContract.pmContractId,
      proposalDate: new Date(this.proposedDate).toLocaleDateString('en-GB'),
      reason: this.reason,
      attachment: '',
      ArPdcInterfaceId: this.selectedContract?.arPdcInterfaceId, 
      TenancyName: tenancyName,
//this.selectedContract.listPmContractPayments[0].id
    };

    // رفع الملف أولاً
    if (this.attachment) {
      this._SpinnerService.showSpinner();
      this.landingService.uploadAttachment(this.attachment).subscribe({
        next: (res) => {
          console.log('Attachment uploaded successfully', res);
          requestBody.attachment = res?.result ? res?.result : '';
          // بعد رفع الملف، يمكن إرسال طلب تأجيل الشيك
          this.createRequestChequeDelay(requestBody);
        },
        error: (error) => {
          this._SpinnerService.hideSpinner();
          console.error('Error uploading attachment', error);
        }
      });
    } else {
      this.createRequestChequeDelay(requestBody);

    }
  }

  createRequestChequeDelay(requestBody: any) {
    this.landingService.createRequestChequeDelay(requestBody).subscribe({
      next: (res) => {
        this._SpinnerService.hideSpinner();
        console.log('Cheque delay request created successfully', res);
        this.closeModal();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cheque delay request created successfully',
        });
      },
      error: (error) => {
        this._SpinnerService.hideSpinner();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error creating cheque delay request',
        });
      }
    });
  }

  // Close modal programmatically using Bootstrap's Modal class
  closeModal() {
    const closeButton = document.getElementById('closeModal') as HTMLButtonElement;
    // Trigger a click event on the button to close the modal
    if (closeButton) {
      closeButton.click();
    }
  }

}
