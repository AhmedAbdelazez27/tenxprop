import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../servicesApi/landing.service';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [TranslateModule,CommonModule,FormsModule,RouterModule],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss'
})
export class ContractComponent implements OnInit{
 
  currentLang: string = 'en'; // or 'ar', based on your logic
  contractsList: any[]=[];
  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private translate: TranslateService,
    private landingService: LandingService

  ){
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }
  ngOnInit(): void {
    this.getContracts();
  }

  
    getContracts(){
      this._SpinnerService.showSpinner();
      this.landingService.getContracts({TenantId:7,'Params.PmTenantId':23}).subscribe({
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

    getStatusClass(status: any): string {
      if (!status) {
        return ''; // If status is not available, return empty
      }
    
      // Check the status and return the corresponding class
      switch (status.nameEn) {
        case 'Posted':
          return 'status-green';
        case 'New':
          return 'status-yellow';
        case 'Canceled':
          return 'status-red';
        default:
          return '';
      }
    };
}
