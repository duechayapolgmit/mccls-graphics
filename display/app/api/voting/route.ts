import { NextResponse, type NextRequest } from "next/server";
import { getData, setGame, setGameInSlot, resetVoting} from '@/lib/voting/votingInfo'

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // read from queries
    const slotUpdate = searchParams.get('slot')
    const gameUpdate = searchParams.get('game')

    const reset = searchParams.get('reset');

    // Update Game Slots
    if (gameUpdate) {
        if (slotUpdate) setGameInSlot(parseInt(slotUpdate), gameUpdate);
        else setGame(gameUpdate);
    }

    // RESET
    if (reset == "true") resetVoting();

    return NextResponse.json(getData());
}