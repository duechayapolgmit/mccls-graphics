export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse, type NextRequest } from "next/server";
import { setGame, setGameInSlot, resetVoting, chooseGame, setDisplayOptions, setGameNumber, setBelowScreen, getVotingData } from '@/lib/server/votingHandler'
import { notifyState } from "@/lib/transmitter/listeners";
import { getConfig } from "@/lib/server/config";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // read from queries
    const slotUpdate = searchParams.get('slot')
    const gameUpdate = searchParams.get('game')

    const slotChosenUpdate = searchParams.get('slotChosen')

    const votingDisplayUpdate = searchParams.get('display')

    const updateGameHistory = searchParams.get('updateGameNo')

    const belowScreenUpdate = searchParams.get('below_screen')

    const reset = searchParams.get('reset');

    // Changes
    let changed = false;

    // Update Game Slots
    if (gameUpdate) {
        if (slotUpdate) changed = await setGameInSlot(parseInt(slotUpdate), gameUpdate);
        else changed = await setGame(gameUpdate);
    }

    // Choose a slot
    if (slotChosenUpdate) changed = await chooseGame(parseInt(slotChosenUpdate));

    // Displays or not
    if (votingDisplayUpdate) {
        if (votingDisplayUpdate == "show") changed = await setDisplayOptions(true);
        else if (votingDisplayUpdate == "hide") changed = await setDisplayOptions(false);
    }

    // update game number based on the event status
    if (updateGameHistory === "true") {
        const config = await getConfig("general");
        const delay = config?.voting.update_delay_ms ?? 0;

        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        const statusRes = await fetch(`${request.nextUrl.origin}/api/event/status`);
        const statusJson = await statusRes.json();

        if (statusJson?.game_number) changed = await setGameNumber(statusJson.game_number)
    }

    if (belowScreenUpdate) {
        // announcement first
        changed = await setBelowScreen(belowScreenUpdate);
        notifyState();

        // delay hold and then turn back to "event_progress"
        const config = await getConfig("general");
        const delay = config?.voting.announcement_hold_ms ?? 0;

        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        const defaultBelow = "event_progress";
        await fetch(`${request.nextUrl.origin}/api/voting?below_screen=${defaultBelow}`);
        changed = await setBelowScreen(defaultBelow)
    }

    // RESET
    if (reset == "true") changed = await resetVoting();

    if (changed) notifyState();

    return NextResponse.json(await getVotingData());
}