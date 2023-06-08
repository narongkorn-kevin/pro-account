import { TestBed } from '@angular/core/testing';

import { SaleFinishResolver } from './sale-finish.resolver';

describe('SaleFinishResolver', () => {
  let resolver: SaleFinishResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SaleFinishResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
