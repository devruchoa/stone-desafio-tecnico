import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeService } from 'src/app/services/time.service';

/**
 * Header component for the application.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /** Observable that emits the current date. */
  date$!: Observable<Date>;
  /** Array of month names. */
  months: string[] = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ];

  /**
   * Creates an instance of HeaderComponent.
   * @param {TimeService} timeService - The time service.
   */
  constructor(private timeService: TimeService) {}

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.date$ = this.timeService.getDate();
  }

  /**
   * Returns the name of the month for the given index.
   * @param {number} monthIndex - The index of the month (0-11).
   * @returns {string} - The name of the month.
   */
  getMonthName(monthIndex: number): string {
    return this.months[monthIndex];
  }

  /**
   * Formats the given date as a string in the format "HH:mm".
   * @param {Date | null} date - The date to format.
   * @returns {string} - The formatted time string.
   */
  formatTime(date: Date | null): string {
    if (date) {
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      return `${hours}:${minutes}`;
    }
    return '--:--';
  }
}
