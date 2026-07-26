import { NextResponse, type NextRequest } from "next/server";
import { getStateData, resetBreakScreen, setBreakScreen, setBreakTimeRemaining, setTimeVisible } from '@/lib/server/breakHandler'
import { notify } from "@/lib/transmitter/listeners";

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // read from queries
    const currentScreen = searchParams.get('current');

    const timeRemaining = searchParams.get('time');
    const timeDisplay = searchParams.get('timeVisible');

    const reset = searchParams.get('reset')

    // Changes
    let changed = false;

    if (currentScreen) changed = setBreakScreen(currentScreen);
    if (timeRemaining) changed = setBreakTimeRemaining(parseInt(timeRemaining));
    if (timeDisplay) {
        if (timeDisplay == "show") changed = setTimeVisible(true);
        else if (timeDisplay == "hide") changed = setTimeVisible(false);
    }

    // RESET
    if (reset == "true") changed = resetBreakScreen();

    if (changed) notify(getStateData(), "break");

    return NextResponse.json(getStateData());
}