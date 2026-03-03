export const dynamic = "force-dynamic"; 
export const fetchCache = "force-no-store";

import { newStream } from '@/lib/transmitter/helper';
import { getData } from '@/lib/voting/votingInfo';

export async function GET() {
  return newStream(getData(), "voting");
}
