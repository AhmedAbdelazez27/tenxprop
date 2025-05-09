import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../servicesApi/landing.service';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-request-service',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule, RouterModule, ToastModule],
  templateUrl: './request-service.component.html',
  styleUrl: './request-service.component.scss',
  providers: [WindowProvider, MessageService]
})
export class RequestServiceComponent implements OnInit {
  currentLang: string = 'en';
  complaintTypes: any[] = [];
  pmPropertiesList: any[] = [];
  units: any[] = [];
  isImage: boolean = false;
  isVideo: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;

  formData = {
    UnitTypeLkpId: '103',
    ComplaintTypeLkpId: '',
    ComplaintDetails: '',
    RequisitionDate: '',
    RequisitionTime: '',
    UnitId: null,
    FilePath: null,
    PmPropertiesId: null,
  };

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
    this.getComplaintTypes();
    this.GetPmProperties();
  }

  GetPmProperties() {
    this.landingService.GetPmProperties().subscribe({
      next: (response) => {
        if (response?.result?.results) {
          this.pmPropertiesList = response.result.results;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading PmProperties',
        });
      }
    });
  }

  onPropertyChange(propertyId: number) {
    this.formData.UnitId = null;
    if (propertyId) {
      this.landingService.getloadUnits(propertyId).subscribe({
        next: (response) => {
          if (response?.result?.results) {
            this.units = response.result.results;
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading units for selected property',
          });
        }
      });
    }
  }

  getComplaintTypes() {
    this.landingService.getComplaintTypes().subscribe({
      next: (response) => {
        if (response?.result?.results) {
          this.complaintTypes = response.result.results;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading complaint types',
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formData.FilePath = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.isImage = file.type.startsWith('image');
        this.isVideo = file.type.startsWith('video');
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    const hostname = this._window.location.hostname;
    const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];
  
    // Format date from "YYYY-MM-DD" to "DD/MM/YYYY"
    const formattedDate = this.formatDateToDDMMYYYY(this.formData.RequisitionDate);
  
    const jsonPayload = {
      UnitTypeLkpId: this.formData.UnitTypeLkpId || '',
      ComplaintTypeLkpId: this.formData.ComplaintTypeLkpId,
      ComplaintDetails: this.formData.ComplaintDetails,
      RequisitionDate: formattedDate,
      RequisitionTime: this.formData.RequisitionTime,
      TenancyName: tenancyName,
      PmPropertiesId: this.formData.PmPropertiesId,
      UnitId: this.formData.UnitId,
    };
  
    this.landingService.createRequisition(jsonPayload).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Requisition created successfully!',
        });
        this.router.navigate(['/Main/Services']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Request Failed',
          detail: error?.error?.message || 'Could not submit request',
        });
      }
    });
  }
  
  // Helper method to convert "YYYY-MM-DD" to "DD/MM/YYYY"
  formatDateToDDMMYYYY(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  

  cancelForm() {
    this.formData = {
      UnitTypeLkpId: '',
      ComplaintTypeLkpId: '',
      ComplaintDetails: '',
      RequisitionDate: '',
      RequisitionTime: '',
      UnitId: null,
      FilePath: null,
      PmPropertiesId: null,
    };
    this.units = [];
    this.previewUrl = null;
  }

  routeTo(link: string) {
    this.router.navigate([link]);
  }
}
