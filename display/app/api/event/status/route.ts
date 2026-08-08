import { NextResponse, type NextRequest } from "next/server";
import { notify } from "@/lib/transmitter/listeners";
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

        changed = await setGameNumber(currentGameNo)
    }

    if (changed) notify(getEventStatus(), "event_status");

    return NextResponse.json(getEventStatus());
}