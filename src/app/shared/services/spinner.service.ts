import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerCount = 0;

  constructor(private spinner: NgxSpinnerService) {}

  showSpinner() {
    this.spinnerCount++;
    if (this.spinnerCount === 1) {
      this.spinner.show();
    }
  }

  hideSpinner() {
    if (this.spinnerCount > 0) {
      this.spinnerCount--;
      if (this.spinnerCount === 0) {
        this.spinner.hide();
      }
    }
  }
}
