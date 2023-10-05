import { TestBed } from '@angular/core/testing';

import { ChiefTelesaleService } from './chief-telesale.service';

describe('ChiefTelesaleService', () => {
  let service: ChiefTelesaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChiefTelesaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
