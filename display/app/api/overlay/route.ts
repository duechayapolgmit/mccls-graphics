import { NextResponse, type NextRequest } from "next/server";
import {setGameNumber, getGameNumber, getOverlayData} from '@/lib/overlayInfo';

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameUpdate = searchParams.get('gameNo')

    // Current info
    let currentGameNo = getGameNumber();

    if (gameUpdate == null) currentGameNo = currentGameNo;
    else if (gameUpdate == "increase") currentGameNo++;
    else if (gameUpdate == "reset") currentGameNo = 1;
    else currentGameNo = parseInt(gameUpdate);

    // Set back
    setGameNumber(currentGameNo);

    // Get the current data
    const data = getOverlayData();

    return NextResponse.json(data);
}