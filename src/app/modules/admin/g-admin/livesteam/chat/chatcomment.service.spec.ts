import { TestBed } from '@angular/core/testing';

import { ChatcommentService } from './chatcomment.service';

describe('ChatcommentService', () => {
  let service: ChatcommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatcommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
