import { TestBed } from '@angular/core/testing';

import { HelperFunctionService } from './helper-function.service';

describe('HelperFunctionService', () => {
  let service: HelperFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
