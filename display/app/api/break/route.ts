import { NextResponse, type NextRequest } from "next/server";
import { getData, resetBreakScreen, setBreakScreen } from '@/lib/server/breakHandler'
import { notify } from "@/lib/transmitter/listeners";

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // read from queries
    const currentScreen = searchParams.get('current');

    const reset = searchParams.get('reset')

    // Changes
    let changed = false;

    if (currentScreen) changed = setBreakScreen(currentScreen);

    // RESET
    if (reset == "true") changed = resetBreakScreen();

    if (changed) notify(getData(), "break");

    return NextResponse.json(getData());
}