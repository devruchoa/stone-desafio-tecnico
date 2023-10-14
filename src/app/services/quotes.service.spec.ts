import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuotesService } from './quotes.service';
import { from } from 'rxjs';

describe('QuotesService', () => {
  let service: QuotesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuotesService],
    });
    service = TestBed.inject(QuotesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setConversionValue', () => {
    it('should set the conversion value', () => {
      const value = 5.2;
      service.setConversionValue(value);
      expect(service.conversionValue).toEqual(value);
    });
  });

  describe('setStateFee', () => {
    it('should set the state fee', () => {
      const value = 5.2;
      service.setStateFee(value);
      expect(service.stateFee).toEqual(value);
    });
  });

  describe('getQuotes', () => {
    it('should return an Observable', () => {
      const dummyResponse = { USDBRL: { ask: 5.2 } };
      service.getQuotes().subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });
      const req = httpMock.expectOne(service.API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });
  });

  describe('getAskValue', () => {
    it('should return the ask value', () => {
      const dummyResponse = { USDBRL: { ask: 5.2 } };
      service.getAskValue().subscribe((response) => {
        expect(response).toEqual(dummyResponse.USDBRL.ask);
      });
      const req = httpMock.expectOne(service.API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });

    it('should return 0 if ask value is not a number', () => {
      const dummyResponse = { USDBRL: { ask: 'invalid' } };
      service.getAskValue().subscribe((response) => {
        expect(response).toEqual(0);
      });
      const req = httpMock.expectOne(service.API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });
  });

  describe('conversionCalculation', () => {
    it('should calculate the conversion value for cash type', async () => {
      const amount = 100;
      const stateFee = 50;
      const type = 'cash';
      const dummyResponse = { USDBRL: { ask: 5.2 } };
      spyOn(service, 'getAskValue').and.returnValue(from(Promise.resolve(dummyResponse.USDBRL.ask)));
      const conversionValue = await service.conversionCalculation(amount, stateFee, type);
      expect(conversionValue).toEqual((amount / 100 + stateFee / 10000) * (dummyResponse.USDBRL.ask + 0.011));
    });

    it('should calculate the conversion value for non-cash type', async () => {
      const amount = 100;
      const stateFee = 50;
      const type = 'non-cash';
      const dummyResponse = { USDBRL: { ask: 5.2 } };
      spyOn(service, 'getAskValue').and.returnValue(from(Promise.resolve(dummyResponse.USDBRL.ask)));
      const conversionValue = await service.conversionCalculation(amount, stateFee, type);
      expect(conversionValue).toEqual((amount / 100 + stateFee / 10000 + 0.064) * dummyResponse.USDBRL.ask);
    });

    it('should throw an error if quote value is not retrieved', async () => {
      const amount = 100;
      const stateFee = 50;
      const type = 'cash';
      spyOn(service, 'getAskValue').and.returnValue(from(Promise.resolve(undefined as any)));
      try {
        await service.conversionCalculation(amount, stateFee, type);
      } catch (error: any) {
        expect(error.message).toEqual('Failed to retrieve quote value');
      }
    });

    it('should throw an error if input value is invalid', async () => {
      const amount = NaN;
      const stateFee = NaN;
      const type = 'cash';
      spyOn(service, 'getAskValue').and.returnValue(from(Promise.resolve(5.2)));
      try {
        await service.conversionCalculation(amount, stateFee, type);
      } catch (error: any) {
        expect(error.message).toEqual('Invalid input value');
      }
    });

    it('should throw an error if conversion value is not a number', async () => {
      const amount = 100;
      const stateFee = 50;
      const type = 'cash';
      const dummyResponse = { USDBRL: { ask: 'invalid' } };
      spyOn(service, 'getAskValue').and.returnValue(from(Promise.resolve(dummyResponse.USDBRL.ask as any)));
      try {
        await service.conversionCalculation(amount, stateFee, type);
      } catch (error: any) {
        expect(error.message).toEqual('Invalid input value');
      }
    });
  });
});
