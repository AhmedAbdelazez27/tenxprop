

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../servicesApi/landing.service';
import { Inject } from '@angular/core';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-localservice',
  standalone: true,
  imports: [TranslateModule,CommonModule,FormsModule,RouterModule],
  templateUrl: './localservice.component.html',
  styleUrl: './localservice.component.scss',
  providers: [WindowProvider] // 💡 Register the provider HERE
})
export class LocalserviceComponent implements OnInit{
 
  currentLang: string = 'en'; // or 'ar', based on your logic
  localserviceList: any[]=[];
  selectedService: any;
  safeMapUrl: SafeResourceUrl | null = null;

  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private translate: TranslateService,
    private landingService: LandingService,
    @Inject(WINDOW) private _window: Window ,// ✅ FIXED injection
    private sanitizer: DomSanitizer

  ){
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }
  ngOnInit(): void {
    this.GetAllPmLocalservicePortal();
  }

  
  groupedLocalservices: any[] = [];

  GetAllPmLocalservicePortal() {
    this._SpinnerService.showSpinner();
    // const hostname = this._window.location.hostname;
    // const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];
    const id = 46 ;

    this.landingService.GetAllPmLocalservicePortal({ id }).subscribe({
      next: (res) => {
        this._SpinnerService.hideSpinner();
        this.localserviceList = res.result;
        this.groupLocalservices();
      },
      error: () => {
        this._SpinnerService.hideSpinner();
      },
      complete: () => {
        this._SpinnerService.hideSpinner();
      }
    });
  }
  
  groupLocalservices() {
    const groupedByContract = new Map();
  
    for (let service of this.localserviceList) {
      const contractKey = service.contractnumber;
  
      if (!groupedByContract.has(contractKey)) {
        groupedByContract.set(contractKey, []);
      }
  
      groupedByContract.get(contractKey).push(service);
    }
  
    // Now further group each contract group by categoryTypeLkp
    this.groupedLocalservices = Array.from(groupedByContract.entries()).map(
      ([contractnumber, services]) => {
        const categoryMap = new Map();
  
        for (let service of services) {
          const categoryKey = service.categoryTypeLkp;
  
          if (!categoryMap.has(categoryKey)) {
            categoryMap.set(categoryKey, []);
          }
  
          categoryMap.get(categoryKey).push(service);
        }
  
        const categoryGroups = Array.from(categoryMap.entries()).map(
          ([categoryTypeLkp, categoryServices]) => ({
            categoryTypeLkp,
            services: categoryServices
          })
        );
  
        return {
          contractnumber,
          categoryGroups
        };
      }
    );
  }
  

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
    showMapModal: boolean = false;

    openMapPopup(service: any): void {
      this.selectedService = service;
      const embedUrl = this.convertToEmbedUrl(service.locationURL);
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      this.showMapModal = true;
    }
    
    closeMapPopup(): void {
      this.showMapModal = false;
      this.safeMapUrl = null;
    }
    convertToEmbedUrl(url: string): string {

      debugger
      if (url.includes('google.com/maps')) {
        return url.replace('/maps/', '/maps/embed?');
      }
          const encodedAddress = encodeURIComponent(url.trim());
      return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
    }
    
    // UpdateRating(localservice: any) {
    //   this._SpinnerService.showSpinner();
    //   const updatedData = {
    //     ...localservice,
    //     isBookmarked: true
    //   };
    
    //   this.landingService.updateLocalService(updatedData).subscribe({
    //     next: (response) => {
    //       console.log('Updated successfully', response);
    //       this._SpinnerService.hideSpinner();
    //     },
    //     error: (err) => {
    //       console.error('Update failed', err);
    //       this._SpinnerService.hideSpinner();
    //     }
    //   });
    // }
    
    
}










