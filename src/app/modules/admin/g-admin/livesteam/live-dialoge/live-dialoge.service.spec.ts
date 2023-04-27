import { TestBed } from '@angular/core/testing';

import { LiveDialogeService } from './live-dialoge.service';

describe('LiveDialogeService', () => {
  let service: LiveDialogeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveDialogeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
