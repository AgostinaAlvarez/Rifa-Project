import { Test, TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';
import { DateHandlerProvider } from './dateHandler.provider';

describe('DateHandlerProvider', () => {
  let provider: DateHandlerProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateHandlerProvider],
    }).compile();

    provider = module.get<DateHandlerProvider>(DateHandlerProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('timezone', () => {
    it('should convert date to specified timezone', () => {
      const date = new Date('2024-07-23T12:00:00Z');
      const tz = 'America/New_York';
      const result = provider.timezone(date, tz);
      expect(result.format()).toBe(dayjs(date).tz(tz).format());
    });
  });

  describe('subtractCurrentDate', () => {
    it('should subtract specified days from current date', () => {
      const currentDate = new Date('2024-07-23T12:00:00Z');
      const daysToSubtract = 5;
      const result = provider.subtractCurrentDate(currentDate, daysToSubtract);
      const expected = dayjs(currentDate)
        .utc()
        .startOf('day')
        .subtract(daysToSubtract, 'day')
        .format();
      expect(result).toBe(expected);
    });
  });

  describe('addDays', () => {
    it('should add specified days to current date', () => {
      const currentDate = new Date('2024-07-23T12:00:00Z');
      const daysToAdd = 5;
      const result = provider.addDays(currentDate, daysToAdd);
      const expected = dayjs(currentDate)
        .utc()
        .startOf('day')
        .add(daysToAdd, 'day')
        .format();
      expect(result).toBe(expected);
    });
  });

  describe('addUnit', () => {
    it('should add specified unit to current date', () => {
      const currentDate = new Date('2024-07-23T12:00:00Z');
      const qty = 5;
      const unit = 'month';
      const result = provider.addUnit(currentDate, qty, unit);
      const expected = dayjs(currentDate)
        .utc()
        .startOf('day')
        .add(qty, unit)
        .format();
      expect(result).toBe(expected);
    });
  });

  describe('endOfUnit', () => {
    it('should get the end of specified unit for current date', () => {
      const currentDate = new Date('2024-07-23T12:00:00Z');
      const unit = 'month';
      const result = provider.endOfUnit(currentDate, unit);
      const expected = dayjs(currentDate).utc().endOf(unit).format();
      expect(result).toBe(expected);
    });
  });

  describe('getFormatDate', () => {
    it('should format date according to the provided format and timezone', () => {
      const date = new Date('2024-07-23T12:00:00Z');
      const format = 'YYYY-MM-DDTHH:mm:ssZ';
      const tz = 'America/New_York';
      const result = provider.getFormatDate(date, format, tz);
      const expected = dayjs(date).tz(tz).format(format);
      expect(result).toBe(expected);
    });
  });

  describe('diff', () => {
    it('should calculate the difference between two dates in specified unit', () => {
      const date1 = new Date('2024-07-23T12:00:00Z');
      const date2 = new Date('2024-07-20T12:00:00Z');
      const unit = 'day';
      const result = provider.diff(date1, date2, unit);
      const expected = dayjs(date1).diff(dayjs(date2), unit);
      expect(result).toBe(expected);
    });
  });
});
