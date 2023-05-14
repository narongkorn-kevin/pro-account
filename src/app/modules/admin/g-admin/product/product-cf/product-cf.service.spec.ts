import { TestBed } from '@angular/core/testing';

import { ProductCfService } from './product-cf.service';

describe('ProductCfService', () => {
  let service: ProductCfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
