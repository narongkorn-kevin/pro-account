import { TestBed } from '@angular/core/testing';

import { SaleFinishService } from './sale-finish.service';

describe('SaleFinishService', () => {
  let service: SaleFinishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleFinishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
