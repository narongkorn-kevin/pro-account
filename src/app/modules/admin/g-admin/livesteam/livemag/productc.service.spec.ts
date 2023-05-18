import { TestBed } from '@angular/core/testing';

import { ProductcService } from './productc.service';

describe('ProductcService', () => {
  let service: ProductcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
