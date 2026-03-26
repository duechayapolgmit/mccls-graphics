export const dynamic = "force-dynamic"; 
export const fetchCache = "force-no-store";

import { getOverlayData } from '@/lib/server/overlayHandler';
import { newStream } from '@/lib/transmitter/helper';

export async function GET() {
  return newStream(getOverlayData(), "overlay");
}
