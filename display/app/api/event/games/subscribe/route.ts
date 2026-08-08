import { newStream } from '@/lib/transmitter/helper';
import { getGames } from '@/lib/server/eventProgressHandler';

export async function GET() {
  return newStream(getGames(), "event_games");
}
