import { getOverlayData } from '@/lib/server/overlayHandler';
import { newStream } from '@/lib/transmitter/helper';

export async function GET() {
  return newStream(await getOverlayData(), "overlay");
}
