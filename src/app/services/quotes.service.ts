import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  readonly API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';
  conversionValue!: number;
  stateFee!: number;

  constructor(private http: HttpClient) {}

  setConversionValue(value: number) {
    this.conversionValue = value;
  }

  setStateFee(value: number) {
    this.stateFee = value;
  }

  getQuotes(): Observable<Object> {
    return this.http.get(this.API_URL);
  }

  getAskValue(): Observable<number> {
    return this.getQuotes().pipe(
      map((response: any) => {
        const askValue = response?.USDBRL?.ask;
        return isNaN(askValue) ? 0 : +askValue;
      })
    );
  }

  async conversionCalculation(
    amount: number,
    stateFee: number,
    type: string
  ): Promise<number> {
    let quoteDollar: number | undefined = await this.getAskValue().toPromise();

    if (!quoteDollar) {
      throw new Error('Failed to retrieve quote value');
    }
    if (isNaN(amount) || isNaN(stateFee) || isNaN(quoteDollar)) {
      throw new Error('Invalid input value');
    }

    const iof = type === 'cash' ? 0.011 : 0.064;

    let conversionValue = 0;
    if (type === 'cash') {
      conversionValue =
        (amount / 100 + stateFee / 10000) * (+quoteDollar + iof);
    } else {
      conversionValue = (amount / 100 + stateFee / 10000 + iof) * +quoteDollar;
    }

    return conversionValue;
  }
}
