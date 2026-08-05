import { NextResponse, type NextRequest } from "next/server";
import { notify } from "@/lib/transmitter/listeners";
import { getPlacements, addGameToHistory, getGames } from "@/lib/server/eventProgressHandler";

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameUpdate = searchParams.get('game')
    // Current info
    let changed = false;

    // Game
    if (gameUpdate) changed = addGameToHistory(gameUpdate);

    if (changed) notify(getGames(), "event_games");

    return NextResponse.json(getGames());
}