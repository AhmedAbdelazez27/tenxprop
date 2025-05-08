import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { LandingService } from '../servicesApi/landing.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{
  contractsList = [
    {
      nameEn: 'Contract 1',
      cheques: [
        { amount: '40,000 AED', dueDate: '01/04/2025', status: 'Pending', paymentMethod: '-' },
        { amount: '40,000 AED', dueDate: '01/05/2025', status: 'Delayed', paymentMethod: '-' },
        { amount: '40,000 AED', dueDate: '01/06/2025', status: 'Cleared', paymentMethod: 'Cheque' }
      ]
    },
    {
      nameEn: 'Contract 2',
      cheques: [
        { amount: '50,000 AED', dueDate: '01/07/2025', status: 'Due', paymentMethod: '-' },
        { amount: '50,000 AED', dueDate: '01/08/2025', status: 'Cleared', paymentMethod: 'Cheque' }
      ]
    }
  ];
  constructor(
    public router: Router,
     private _SpinnerService: SpinnerService,
        private translate: TranslateService,
        private landingService: LandingService
  ){

  }
  ngOnInit(): void {
    this.getPayments();
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-yellow';
      case 'Delayed':
        return 'status-red';
      case 'Cleared':
        return 'status-green';
      case 'Due':
        return 'status-blue';
      default:
        return '';
    }
  };

  getPayments(){
    this._SpinnerService.showSpinner();
    this.landingService.getPayments({Id:1}).subscribe({
      next: (res)=>{
        console.log(res);
        this._SpinnerService.hideSpinner();
        this.contractsList= res.result?.items;
      },
      error: (error)=>{
        this._SpinnerService.hideSpinner();

      },
      complete: ()=>{
        this._SpinnerService.hideSpinner();
      }
    })
  };
}
