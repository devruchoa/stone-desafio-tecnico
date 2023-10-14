import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { QuotesService } from '../../services/quotes.service';
import { Router } from '@angular/router';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isFormValid', () => {
    it('should return false when the form is invalid', () => {
      component.convertForm.controls['amount'].setValue('');
      component.convertForm.controls['stateFee'].setValue('');
      expect(component.isFormValid).toBeFalse();
    });

    it('should return true when the form is valid', () => {
      component.convertForm.controls['amount'].setValue('100');
      component.convertForm.controls['stateFee'].setValue('10');
      expect(component.isFormValid).toBeTrue();
    });
  });

  describe('formatAmount', () => {
    it('should format the input value to a currency format', () => {
      const input = { value: '1000' } as HTMLInputElement;
      component.formatAmount({ target: input } as unknown as Event);
      expect(input.value).toBe('$ 10,00');
    });

    it('should format the input value to a currency format with leading zeros', () => {
      const input = { value: '01' } as HTMLInputElement;
      component.formatAmount({ target: input } as unknown as Event);
      expect(input.value).toBe('$ 0,01');
    });

    it('should format the input value to a currency format with no leading zeros', () => {
      const input = { value: '1' } as HTMLInputElement;
      component.formatAmount({ target: input } as unknown as Event);
      expect(input.value).toBe('$ 0,01');
    });

    it('should format the input value to a currency format with no decimal places', () => {
      const input = { value: '10000' } as HTMLInputElement;
      component.formatAmount({ target: input } as unknown as Event);
      expect(input.value).toBe('$ 100,00');
    });

    it('should format the input value to a currency format with two decimal places when the input has two digits', () => {
      const input = { value: '10' } as HTMLInputElement;
      component.formatAmount({ target: input } as unknown as Event);
      expect(input.value).toBe('$ 0,10');
    });
  });

  describe('formatStateFee', () => {
    it('should format the input value to a percentage format', () => {
      const input = { value: '10' } as HTMLInputElement;
      component.formatStateFee({ target: input } as unknown as Event);
      expect(input.value).toBe('0,10 %');
    });

    it('should format the input value to a percentage format with leading zeros', () => {
      const input = { value: '01' } as HTMLInputElement;
      component.formatStateFee({ target: input } as unknown as Event);
      expect(input.value).toBe('0,01 %');
    });

    it('should format the input value to a percentage format with no leading zeros', () => {
      const input = { value: '1' } as HTMLInputElement;
      component.formatStateFee({ target: input } as unknown as Event);
      expect(input.value).toBe('0,01 %');
    });

    it('should format the input value to a percentage format with no decimal places', () => {
      const input = { value: '100' } as HTMLInputElement;
      component.formatStateFee({ target: input } as unknown as Event);
      expect(input.value).toBe('1,00 %');
    });

    it('should set the cursor position to the end of the input', fakeAsync(() => {
      const input = {
        value: '10',
        selectionStart: 0,
        selectionEnd: 0,
      } as HTMLInputElement;
      component.formatStateFee({ target: input } as unknown as Event);
      tick();
      expect(input.selectionStart).toBe(input.selectionEnd);
      expect(input.selectionStart).toBe(input.value.length - 2);
    }));
  });

  describe('convertForm', () => {
    it('should be invalid when empty', () => {
      expect(component.convertForm.valid).toBeFalse();
    });

    it('should be invalid when amount is negative', () => {
      component.convertForm.controls['amount'].setValue('-100');
      component.convertForm.controls['stateFee'].setValue('10');
      expect(component.convertForm.valid).toBeFalse();
    });

    it('should be invalid when stateFee is negative', () => {
      component.convertForm.controls['amount'].setValue('100');
      component.convertForm.controls['stateFee'].setValue('-10');
      expect(component.convertForm.valid).toBeFalse();
    });

    it('should be valid when amount and stateFee are positive', () => {
      component.convertForm.controls['amount'].setValue('100');
      component.convertForm.controls['stateFee'].setValue('10');
      expect(component.convertForm.valid).toBeTrue();
    });
  });

  describe('type', () => {
    it('should default to cash', () => {
      expect(component.convertForm.controls['type'].value).toBe('cash');
    });

    it('should allow setting to card', () => {
      component.convertForm.controls['type'].setValue('card');
      expect(component.convertForm.controls['type'].value).toBe('card');
    });
  });

  describe('onSubmit', () => {
    let quotesService: QuotesService;
    let router: Router;

    beforeEach(() => {
      quotesService = TestBed.inject(QuotesService);
      router = TestBed.inject(Router);
    });

    it('should perform the conversion calculation and navigate to the result page with valid form values', fakeAsync(() => {
      spyOn(quotesService, 'conversionCalculation').and.returnValue(Promise.resolve(50));
      spyOn(quotesService, 'setConversionValue');
      spyOn(quotesService, 'setStateFee');
      spyOn(router, 'navigate');

      component.convertForm.controls['amount'].setValue('100');
      component.convertForm.controls['stateFee'].setValue('10');

      component.onSubmit();

      tick();

      expect(quotesService.conversionCalculation).toHaveBeenCalledWith(100, 10, 'cash');
      expect(quotesService.setConversionValue).toHaveBeenCalledWith(50);
      expect(quotesService.setStateFee).toHaveBeenCalledWith(10);
      expect(router.navigate).toHaveBeenCalledWith(['result'], { state: { result: 50 }, queryParams: { submitted: true } });
    }));

    it('should not perform the conversion calculation and not navigate to the result page with invalid form values', fakeAsync(() => {
      spyOn(quotesService, 'conversionCalculation');
      spyOn(quotesService, 'setConversionValue');
      spyOn(quotesService, 'setStateFee');
      spyOn(router, 'navigate');

      component.convertForm.controls['amount'].setValue('-100');
      component.convertForm.controls['stateFee'].setValue('10');

      component.onSubmit();

      tick();

      expect(quotesService.conversionCalculation).not.toHaveBeenCalled();
      expect(quotesService.setConversionValue).not.toHaveBeenCalled();
      expect(quotesService.setStateFee).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('should display an alert with the error message when the conversion calculation fails', fakeAsync(() => {
      spyOn(quotesService, 'conversionCalculation').and.returnValue(Promise.reject({ message: 'Conversion calculation failed' }));
      spyOn(window, 'alert');

      component.convertForm.controls['amount'].setValue('100');
      component.convertForm.controls['stateFee'].setValue('10');

      component.onSubmit();

      tick();

      expect(window.alert).toHaveBeenCalledWith('Conversion calculation failed');
    }));
  });
});
