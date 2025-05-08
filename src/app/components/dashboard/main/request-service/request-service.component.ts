// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-request-service',
//   standalone: true,
//   imports: [],
//   templateUrl: './request-service.component.html',
//   styleUrl: './request-service.component.scss'
// })
// export class RequestServiceComponent {

// }
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../servicesApi/landing.service';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';

@Component({
  selector: 'app-request-service',
standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './request-service.component.html',
  styleUrl: './request-service.component.scss',
  providers: [WindowProvider]
})
export class RequestServiceComponent implements OnInit {
  currentLang: string = 'en';
  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private translate: TranslateService,
    private landingService: LandingService,
    @Inject(WINDOW) private _window: Window
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
  }

 
  routeTo(link:string){
    this.router.navigate([link]);
  }
 
}

