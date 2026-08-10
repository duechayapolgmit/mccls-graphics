import { newStream } from '@/lib/transmitter/helper';
import { getPlacements } from '@/lib/server/eventProgressHandler';

export function GET() {
  return newStream(getPlacements(), "event_placements");
}
