import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { LandingService } from '../servicesApi/landing.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';

@Component({
  selector: 'app-delaychequerequest',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './delaychequerequest.component.html',
  styleUrl: './delaychequerequest.component.scss',
  providers: [WindowProvider, MessageService]
})
export class DelaychequerequestComponent implements OnInit {
  contractsList: any[] = [];
  paymentsList: any[] = [];
  selectedContract: any = null;  // Selected contract object
  selectedCheque: any = null;  // Selected cheque object
  proposedDate: any;  // Proposed date
  reason: string = '';  // Reason for delay
  attachment: File | null = null;  // Optional attachment
  formSubmitted: boolean = false;  // Flag to control validation display
  attachmentName: string = "";
  userData: any;

  constructor(
    public router: Router,
    private _SpinnerService: SpinnerService,
    private translate: TranslateService,
    private landingService: LandingService,
    private messageService: MessageService,
    @Inject(WINDOW) private _window: Window
    
  ) { 
     let data = localStorage.getItem("userData")
    this.userData = data ? JSON.parse(data) : {};
  }

  ngOnInit(): void {
    this.getContract();
  }

  getContract() {
    this.landingService.getContractOptions({ Id:this.userData?.userId,pageSize: 1000, pageNumber: 1 }).subscribe({
      next: (res) => {
        this.contractsList = res?.result?.results;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getContractChild(parentID: any) {
    this.landingService.getContractChildrenOptions({ parentId: parentID, pageSize: 1000, pageNumber: 1 }).subscribe({
      next: (res) => {
        this.paymentsList = res?.result?.results;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Fired when unit is changed
  onUnitChange(event: any): void {
    const selectedValue = event.target.value;
    console.log('Selected Unit ID:', selectedValue);
    this.selectedContract = selectedValue;
    this.getContractChild(event.target.value);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;  // Type assertion
    if (input && input.files) {
      this.attachment = input.files[0];
      this.attachmentName = input.files[0].name;
    }
  }

  // Handle form submission
  submitForm() {
    debugger
    console.log(this.selectedCheque , this.selectedContract);
   const hostname = this._window.location.hostname;
    const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];
    if (!this.proposedDate || !this.reason || !this.selectedContract || !this.selectedCheque) {
      this.formSubmitted = true;
      // Handle the case where the form is invalid
      return;
    }
    let requestBody = {
      PmContractId: +this.selectedContract,
      ArPdcInterfaceId: +this.selectedCheque,
      proposalDate: new Date(this.proposedDate).toLocaleDateString('en-GB'),
      reason: this.reason,
      attachment: '',
     TenancyName: tenancyName,

      
    };

    // رفع الملف أولاً
    if (this.attachment) {
      this._SpinnerService.showSpinner();
      this.landingService.uploadAttachment(this.attachment).subscribe({
        next: (res) => {
          console.log('Attachment uploaded successfully', res);
          requestBody.attachment = res?.result ? res?.result : '';
          // بعد رفع الملف، يمكن إرسال طلب تأجيل الشيك
          this.createRequestChequeDelay(requestBody);0
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
  cancel() {
    this.router.navigate(['/Main/CheckRequest']);
  }
    createRequestChequeDelay(requestBody: any) {
    this.landingService.createRequestChequeDelay(requestBody).subscribe({
      next: (res) => {
        this._SpinnerService.hideSpinner();
        console.log('Cheque delay request created successfully', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cheque delay request created successfully',
        });
        setTimeout(() => {
          this.router.navigate(['/Main/Home'])
        }, 400);
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
}
