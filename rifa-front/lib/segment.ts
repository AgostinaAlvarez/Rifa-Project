import {AnalyticsBrowser} from '@segment/analytics-next';
import {Events} from './enums/Events';

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_KEY as string,
});

type ValueType = string | number | null;

type FlexibleObject = Record<string, ValueType>;

export function identify(_id: string | null, data: FlexibleObject): void {
  analytics.identify(_id, data);
}

export function track(event: Events, data: FlexibleObject): void {
  analytics.track(event, data);
}
