import { Observable, interval, map } from 'rxjs';
import { Injectable } from '@angular/core';


/**
 * A service that provides the current date as an Observable.
 */
@Injectable({
  providedIn: 'root'
})
export class TimeService {
  constructor() {}

  /**
   * Returns an Observable that emits the current date every second.
   * @returns An Observable that emits the current date every second.
   */
  getDate(): Observable<Date> {
    return interval(1000).pipe(map(() => new Date()));
  }
}
