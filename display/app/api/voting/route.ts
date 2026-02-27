import { NextResponse, type NextRequest } from "next/server";
import { getData, setGame, setGameInSlot, resetVoting, chooseGame, setDisplayOptions} from '@/lib/voting/votingInfo'

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // read from queries
    const slotUpdate = searchParams.get('slot')
    const gameUpdate = searchParams.get('game')

    const slotChosenUpdate = searchParams.get('slotChosen')

    const votingDisplayUpdate = searchParams.get('display')

    const reset = searchParams.get('reset');

    // Update Game Slots
    if (gameUpdate) {
        if (slotUpdate) setGameInSlot(parseInt(slotUpdate), gameUpdate);
        else setGame(gameUpdate);
    }

    // Choose a slot
    if (slotChosenUpdate) chooseGame(parseInt(slotChosenUpdate));

    // Displays or not
    if (votingDisplayUpdate) {
        if (votingDisplayUpdate == "show") setDisplayOptions(true);
        else if (votingDisplayUpdate == "hide") setDisplayOptions(false);
    }

    // RESET
    if (reset == "true") resetVoting();

    return NextResponse.json(getData());
}