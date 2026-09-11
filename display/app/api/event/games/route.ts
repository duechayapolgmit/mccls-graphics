export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { NextResponse, type NextRequest } from "next/server";
import { notifyState } from "@/lib/transmitter/listeners";
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

    if (changed) notifyState();

    return NextResponse.json(games);
}