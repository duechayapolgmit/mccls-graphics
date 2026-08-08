import { newStream } from '@/lib/transmitter/helper';
import { getStateData } from '@/lib/server/breakHandler';

export async function GET() {
  return newStream(getStateData(), "break");
}
