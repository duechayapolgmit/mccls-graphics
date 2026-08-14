import { newStream } from '@/lib/transmitter/helper';
import { getGames } from '@/lib/server/eventProgressHandler';

export function GET() {
  return newStream(getGames(), "event_games");
}
