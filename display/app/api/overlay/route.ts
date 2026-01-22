import { NextResponse, type NextRequest } from "next/server";
import {setGameNumber, getGameNumber, getOverlayData, getGame, setGame} from '@/lib/overlayInfo';

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameNoUpdate = searchParams.get('gameNo')
    const gameUpdate = searchParams.get('game')

    // Current info
    let currentGameNo = getGameNumber();
    let currentGame = getGame();
    
    // Game Number
    if (gameNoUpdate == null || gameNoUpdate == undefined) currentGameNo = currentGameNo;
    else if (gameNoUpdate == "increase") currentGameNo++;
    else if (gameNoUpdate == "reset") currentGameNo = 1;
    else currentGameNo = parseInt(gameNoUpdate);

    // Game
    if (gameUpdate == null || gameUpdate == undefined) currentGame = currentGame;
    else currentGame = gameUpdate;

    // Set back
    setGameNumber(currentGameNo);
    setGame(currentGame);

    // Get the current data
    const data = getOverlayData();

    return NextResponse.json(data);
}