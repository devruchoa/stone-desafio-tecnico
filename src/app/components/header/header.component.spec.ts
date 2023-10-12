import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TimeService } from 'src/app/services/time.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let timeService: jasmine.SpyObj<TimeService>;

  beforeEach(() => {
    timeService = jasmine.createSpyObj('TimeService', ['getDate']);
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: TimeService, useValue: timeService }],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set date$ to the observable returned by timeService.getDate', () => {
      const date = new Date();
      timeService.getDate.and.returnValue(of(date));
      component.ngOnInit();
      component.date$.subscribe((result) => {
        expect(result).toEqual(date);
      })
    });
  });

  describe('getMonthName', () => {
    it('should return the name of the month for the given index', () => {
      expect(component.getMonthName(0)).toBe('janeiro');
      expect(component.getMonthName(1)).toBe('fevereiro');
      expect(component.getMonthName(2)).toBe('março');
      expect(component.getMonthName(3)).toBe('abril');
      expect(component.getMonthName(4)).toBe('maio');
      expect(component.getMonthName(5)).toBe('junho');
      expect(component.getMonthName(6)).toBe('julho');
      expect(component.getMonthName(7)).toBe('agosto');
      expect(component.getMonthName(8)).toBe('setembro');
      expect(component.getMonthName(9)).toBe('outubro');
      expect(component.getMonthName(10)).toBe('novembro');
      expect(component.getMonthName(11)).toBe('dezembro');
    });
  });

  describe('formatTime', () => {
    it('should return the formatted time string for the given date', () => {
      expect(component.formatTime(new Date('2022-01-01T12:34:56'))).toBe(
        '12:34'
      );
      expect(component.formatTime(new Date('2022-01-01T01:02:03'))).toBe(
        '01:02'
      );
    });

    it('should return "--:--" if the given date is null', () => {
      expect(component.formatTime(null)).toBe('--:--');
    });
  });
});
