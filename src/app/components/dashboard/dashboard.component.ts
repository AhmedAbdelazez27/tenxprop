import { Component, OnDestroy, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { FooterComponent } from '../../shared/components/footer/footer.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavBarComponent,
    DropdownModule,
    DialogModule,
    FooterComponent
  ],
  providers: [DialogService]
})
export class DashboardComponent implements OnInit,OnDestroy{
    constructor(
  ) { }


  ngOnInit() { }

  ngOnDestroy(): void {
    
  }
  
}
