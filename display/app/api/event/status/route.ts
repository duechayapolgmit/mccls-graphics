export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse, type NextRequest } from "next/server";
import { notifyState } from "@/lib/transmitter/listeners";
import { getEventStatus, getGameNumber, setGameNumber } from "@/lib/server/eventProgressHandler";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameNoUpdate = searchParams.get('gameNo')

    // Current info
    let changed = false;
  
    // Game Number
    if (gameNoUpdate) {
        let currentGameNo = getGameNumber();

        switch(gameNoUpdate) {
            case "increase":
                currentGameNo++;
                break;
            case "reset":
                currentGameNo = 1;
                break;
            default:
                currentGameNo = parseInt(gameNoUpdate);
                break;
        }

        changed = setGameNumber(currentGameNo)
    }

    const status = await getEventStatus();
    
    if (changed) notifyState();

    return NextResponse.json(status);
}