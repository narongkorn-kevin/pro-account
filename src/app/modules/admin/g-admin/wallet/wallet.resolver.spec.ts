import { TestBed } from '@angular/core/testing';

import { WalletResolver } from './wallet.resolver';

describe('WalletResolver', () => {
  let resolver: WalletResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(WalletResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
