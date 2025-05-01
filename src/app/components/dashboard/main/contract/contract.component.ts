import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [TranslateModule,CommonModule,FormsModule],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss'
})
export class ContractComponent implements OnInit{
 
  currentLang: string = 'en'; // or 'ar', based on your logic

  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private translate: TranslateService
  ){
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }
  ngOnInit(): void {
  }

}
