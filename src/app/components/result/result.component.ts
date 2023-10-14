import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotesService } from 'src/app/services/quotes.service';

/**
 * Component that displays the result of a currency conversion.
 */
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  /** The result of the currency conversion. */
  conversionResult: number;

  /** The current dollar quotation. */
  dollarQuotation!: string;

  /**
   * Creates an instance of ResultComponent.
   * @param router The router service.
   * @param quotesService The quotes service.
   */
  constructor(private router: Router, private quotesService: QuotesService) {
    this.conversionResult = history.state.result;

    this.quotesService.getAskValue().subscribe((value: number) => {
      this.dollarQuotation = this.formatResult(value);
    });

    if (!this.conversionResult) {
      this.router.navigate(['/']);
    }
  }

  /** The state fee for the currency conversion. */
  get stateFee() {
    return this.quotesService.stateFee;
  }

  /** Navigates back to the currency conversion page. */
  onGoBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Formats a number as a string with two decimal places and a comma as the decimal separator.
   * @param value The number to format.
   * @returns The formatted string.
   */
  formatResult(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }
}
