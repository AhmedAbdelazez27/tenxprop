import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LandingService } from '../servicesApi/landing.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [WindowProvider,MessageService]
})
export class LandingComponent implements OnInit {

  currentLang: string;
  contractsList: any[]=[];
  notifications: any[] = [];  
  userData: any;

  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private landingService: LandingService,
    @Inject(WINDOW) private _window: Window
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
    let data = localStorage.getItem("userData")
    this.userData = data ? JSON.parse(data) : {};
  }
  ngOnInit(): void {
    this.getContracts();
    this.Getnotifications();

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
  Getnotifications() {
    this._SpinnerService.showSpinner();
    const hostname = this._window.location.hostname;
    const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];

    this.landingService.Getnotifications({ tenancyName,userId:this.userData.userId}).subscribe({
      next: (res) => {
        this._SpinnerService.hideSpinner();
  
        if (res.success && res.result) {
          this.notifications = res.result.map((item: any) => {
            const props = item.notification.data.properties || {};
            return {
               message: props.Message || '',
               date: props.Date || '',
               id: props.id || '',
               number: props.number || ''

              // date: item.notification.creationTime
            };
          });
        }
      },
      error: () => {
        this._SpinnerService.hideSpinner();
      },
      complete: () => {
        this._SpinnerService.hideSpinner();
      }
    });
  }

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

  renewContract(event:Event,id: any) {
    event.stopPropagation();
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
