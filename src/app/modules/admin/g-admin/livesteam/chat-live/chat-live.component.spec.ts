import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLiveComponent } from './chat-live.component';

describe('ChatLiveComponent', () => {
  let component: ChatLiveComponent;
  let fixture: ComponentFixture<ChatLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatLiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
