export const dynamic = "force-dynamic"; 
export const fetchCache = "force-no-store";

import { newStream } from '@/lib/transmitter/helper';
import { getEventStatus } from '@/lib/server/eventProgressHandler';

export async function GET() {
  return newStream(getEventStatus(), "event_status");
}
