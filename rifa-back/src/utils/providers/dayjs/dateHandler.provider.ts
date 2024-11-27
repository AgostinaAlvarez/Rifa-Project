/* eslint-disable no-restricted-globals */
import { Injectable } from '@nestjs/common';
// https://day.js.org/docs/en/installation/installation
import dayjs, { ManipulateType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

type Dayjs = typeof dayjs;
type DateJs = dayjs.Dayjs | Date | string;
@Injectable()
export class DateHandlerProvider {
  private tz: Dayjs;

  constructor() {
    const tzb = dayjs;
    tzb.extend(utc);
    tzb.extend(timezone);
    tzb.extend(isBetween);
    this.tz = tzb;
  }

  timezone(date: DateJs, tz: string): dayjs.Dayjs {
    return this.tz(date).tz(tz);
  }

  subtractCurrentDate(
    currentDate: Date,
    daysToSubtract: number,
    unit?: ManipulateType,
  ): any {
    return dayjs(currentDate)
      .utc()
      .startOf(unit || 'day')
      .subtract(daysToSubtract, 'day')
      .format();
  }

  addDays(currentDate: Date, daysToAdd: number, unit?: ManipulateType): DateJs {
    return dayjs(currentDate)
      .utc()
      .startOf(unit || 'day')
      .add(daysToAdd, 'day')
      .format();
  }

  addUnit(currentDate: Date, qty: number, unit: ManipulateType): DateJs {
    return dayjs(currentDate).utc().startOf('day').add(qty, unit).format();
  }

  endOfUnit(currentDate: Date, unit: ManipulateType): DateJs {
    return dayjs(currentDate).utc().endOf(unit).format();
  }

  getFormatDate(start: DateJs, format: string, tz = 'utc'): string {
    return dayjs(start).tz(tz).format(format);
  }

  diff(date1: DateJs, date2: DateJs, unit: ManipulateType): number {
    return this.tz(date1).diff(this.tz(date2), unit);
  }
}
