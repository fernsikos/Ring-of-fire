import { TestBed } from '@angular/core/testing';

import { VarServiceService } from './var-service.service';

describe('VarServiceService', () => {
  let service: VarServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VarServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
