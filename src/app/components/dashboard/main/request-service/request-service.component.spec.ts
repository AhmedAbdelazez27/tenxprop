import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestServiceComponent } from './request-service.component';

describe('RequestServiceComponent', () => {
  let component: RequestServiceComponent;
  let fixture: ComponentFixture<RequestServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
