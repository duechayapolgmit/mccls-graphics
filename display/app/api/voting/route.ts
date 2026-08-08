import { NextResponse, type NextRequest } from "next/server";
import { getData, setGame, setGameInSlot, resetVoting, chooseGame, setDisplayOptions, setGameNumber } from '@/lib/server/votingHandler'
import { notify } from "@/lib/transmitter/listeners";
import { getConfig } from "@/lib/client/config";

const config = getConfig();

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // read from queries
    const slotUpdate = searchParams.get('slot')
    const gameUpdate = searchParams.get('game')

    const slotChosenUpdate = searchParams.get('slotChosen')

    const votingDisplayUpdate = searchParams.get('display')

    const updateGameHistory = searchParams.get('updateGameNo')

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

    // update game number based on the event status
    if (updateGameHistory === "true") {
        const delay = config.voting?.update_delay_ms ?? 0;

        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        const statusRes = await fetch(`${request.nextUrl.origin}/api/event/status`);
        const statusJson = await statusRes.json();

        if (statusJson?.game_number) changed = setGameNumber(statusJson.game_number)
    }

    // RESET
    if (reset == "true") changed = resetVoting();

    if (changed) notify(getData(), "voting");

    return NextResponse.json(getData());
}