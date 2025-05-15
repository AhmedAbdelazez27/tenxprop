import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckRequestComponent } from './check-request.component';

describe('CheckRequestComponent', () => {
  let component: CheckRequestComponent;
  let fixture: ComponentFixture<CheckRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
