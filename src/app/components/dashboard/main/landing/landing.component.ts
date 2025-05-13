import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LandingService } from '../servicesApi/landing.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [MessageService]
})
export class LandingComponent implements OnInit {

  currentLang: string;
  contractsList: any[] = [];
  userData: any;

  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private landingService: LandingService
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
    let data = localStorage.getItem("userData")
    this.userData = data ? JSON.parse(data) : {};
  }
  ngOnInit(): void {
    this.getContracts();
  }

  routeTo(link: string) {
    this.router.navigate([link]);
  }
  getContracts() {
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

  getStatusClass(status: any): string {
    console.log("status = ", status);

    if (!status) {
      return ''; // If status is not available, return empty
    }

    // Check the status and return the corresponding class
    switch (status) {
      case 'Posted':
        return 'status-green';
      case 'Renew':
        return 'status-renew';
      case 'New':
        return 'status-yellow';
      case 'Canceled':
        return 'status-red';
      default:
        return '';
    }
  }

  renewContract(id: any) {
    let userId = null; // تعيين قيمة افتراضية

    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        userId = JSON.parse(userData)?.userId;
      } catch (e) {
        console.error('Error parsing userData from localStorage', e);
      }
    }

    console.log(id);
    this._SpinnerService.showSpinner();
    this.landingService.renewContract({ id: id, userId: userId }).subscribe({
      next: (res) => {
        console.log(res);
        this._SpinnerService.hideSpinner();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${res?.result?.reason}`,
        })
        this.getContracts();
      },
      error: (err) => {
        console.log(err);
        this._SpinnerService.hideSpinner();

      }
    })
  };

  routeToDetails(arg0: any) {
    this.router.navigate(['/Main/Contract'], { queryParams: { currentItemCollapsed: arg0 } });
  }

}
