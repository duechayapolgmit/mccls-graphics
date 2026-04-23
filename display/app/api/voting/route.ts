import { NextResponse, type NextRequest } from "next/server";
import { getData, setGame, setGameInSlot, resetVoting, chooseGame, setDisplayOptions } from '@/lib/server/votingHandler'
import { notify } from "@/lib/transmitter/listeners";

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // read from queries
    const slotUpdate = searchParams.get('slot')
    const gameUpdate = searchParams.get('game')

    const slotChosenUpdate = searchParams.get('slotChosen')

    const votingDisplayUpdate = searchParams.get('display')

    const reset = searchParams.get('reset');

    // Changes
    let changed = false;

    // Update Game Slots
    if (gameUpdate) {
        if (slotUpdate) changed = setGameInSlot(parseInt(slotUpdate), gameUpdate);
        else changed = setGame(gameUpdate);
    }

    // Choose a slot
    if (slotChosenUpdate) changed = chooseGame(parseInt(slotChosenUpdate));

    // Displays or not
    if (votingDisplayUpdate) {
        if (votingDisplayUpdate == "show") changed = setDisplayOptions(true);
        else if (votingDisplayUpdate == "hide") changed = setDisplayOptions(false);
    }

    // RESET
    if (reset == "true") changed = resetVoting();

    if (changed) notify(getData(), "voting");

    return NextResponse.json(getData());
}