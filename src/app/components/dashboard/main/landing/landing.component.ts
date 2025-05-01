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
  imports: [CommonModule, ToastModule, FormsModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [MessageService]
})
export class LandingComponent implements OnInit {
  currentLang: string;

  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
    console.log(this.currentLang);
    
  }
  ngOnInit(): void {
   
  }




}
