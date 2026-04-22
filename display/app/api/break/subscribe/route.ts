export const dynamic = "force-dynamic"; 
export const fetchCache = "force-no-store";

import { newStream } from '@/lib/transmitter/helper';
import { getData } from '@/lib/server/breakHandler';

export async function GET() {
  return newStream(getData(), "break");
}
