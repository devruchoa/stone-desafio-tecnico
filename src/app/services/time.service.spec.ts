import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TimeService } from './time.service';
import { take } from 'rxjs';

describe('TimeService', () => {
  let service: TimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the current date every second', fakeAsync(() => {
    let currentDate: Date | null = null;
    service.getDate().pipe(take(3)).subscribe(date => {
      currentDate = date;
    });
    tick(1000);
    expect(currentDate).not.toBeNull();
    expect(currentDate).toEqual(jasmine.any(Date));
    tick(1000);
    expect(currentDate).not.toBeNull();
    expect(currentDate).toEqual(jasmine.any(Date));
    tick(1000);
    expect(currentDate).not.toBeNull();
    expect(currentDate).toEqual(jasmine.any(Date));
  }));
});
