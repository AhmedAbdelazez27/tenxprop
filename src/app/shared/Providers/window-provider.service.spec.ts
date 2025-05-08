import { TestBed } from '@angular/core/testing';

import { WindowProviderService } from './window-provider.service';

describe('WindowProviderService', () => {
  let service: WindowProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
