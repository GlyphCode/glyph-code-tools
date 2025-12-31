import { TestBed } from '@angular/core/testing';

import { EventBusServiceService } from './event-bus-service.service';

describe('EventBusServiceService', () => {
  let service: EventBusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
