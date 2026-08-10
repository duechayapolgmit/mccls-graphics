import { NextResponse, type NextRequest } from "next/server";
import { notify } from "@/lib/transmitter/listeners";
import { addGameToHistory, getGames } from "@/lib/server/eventProgressHandler";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameUpdate = searchParams.get('game')
    // Current info
    let changed = false;

    // Game
    if (gameUpdate) changed = addGameToHistory(gameUpdate);

    const games = await getGames();

    if (changed) notify(games, "event_games");

    return NextResponse.json(games);
}