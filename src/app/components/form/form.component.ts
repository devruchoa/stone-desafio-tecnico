import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotesService } from 'src/app/services/quotes.service';

/**
 * Component that represents a form to convert an amount of money.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  /**
   * FormGroup that contains the form controls for the conversion.
   */
  convertForm: FormGroup = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    stateFee: new FormControl('', [Validators.required, Validators.min(0)]),
    type: new FormControl('cash'),
  });

  /**
   * The result of the conversation.
   */
  conversationResult!: number;

  /**
   * Constructs a new instance of the FormComponent class.
   * @param quotesService - The QuotesService instance to use for retrieving quotes.
   * @param router - The Router instance to use for navigating between routes.
   */
  constructor(private quotesService: QuotesService, private router: Router) {}

  /**
   * Returns whether the form is valid or not.
   */
  get isFormValid(): boolean {
    return this.convertForm.valid;
  }

  /**
   * Formats the amount input value to a currency format.
   * @param event - The input event.
   */
  formatAmount(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/^0+/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, -2)},${value.slice(-2)}`;
    } else if (value.length === 2) {
      value = `0,${value}`;
    } else {
      value = `0,0${value}`;
    }
    input.value = `$ ${value}`;
  }

  /**
   * Formats the state fee input value to a percentage format.
   * @param event - The input event.
   */
  formatStateFee(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/^0+/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, -2)},${value.slice(-2)}`;
    } else if (value.length === 2) {
      value = `0,${value}`;
    } else {
      value = `0,0${value}`;
    }
    input.value = `${value} %`;

    input.selectionStart = input.selectionEnd = input.value.length - 2;
  }

  /**
   * Handles the form submission event and performs the conversion calculation.
   * @returns {Promise<void>} A Promise that resolves when the conversion calculation is complete.
   */
  async onSubmit(): Promise<void> {
    if (this.convertForm.valid) {
      const amount = Number(
        this.convertForm.get('amount')?.value.replace(/\D/g, '')
      );
      const stateFee = Number(
        this.convertForm.get('stateFee')?.value.replace(/\D/g, '')
      );
      const type: string = this.convertForm.get('type')?.value;
      await this.quotesService
        .conversionCalculation(amount, stateFee, type)
        .then((conversionValue) => {
          this.conversationResult = conversionValue;
          this.quotesService.setConversionValue(conversionValue);
          this.quotesService.setStateFee(stateFee);
          this.router.navigate(['result'], {
            state: { result: conversionValue },
            queryParams: { submitted: true },
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }
}
