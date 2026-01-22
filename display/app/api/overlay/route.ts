import { NextResponse, type NextRequest } from "next/server";
import {setGameNumber, getGameNumber, getOverlayData, getGame, setGame, getFirstPlace, getSecondPlace, setFirstPlace, setSecondPlace} from '@/lib/overlayInfo';

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameNoUpdate = searchParams.get('gameNo')
    const gameUpdate = searchParams.get('game')
    const firstUpdate = searchParams.get('first')
    const secondUpdate = searchParams.get('second')

    // Current info
    let currentGameNo = getGameNumber();
    let currentGame = getGame();
    let currentFirstPlace = getFirstPlace();
    let currentSecondPlace = getSecondPlace();
    
    // Game Number
    if (gameNoUpdate == null || gameNoUpdate == undefined) currentGameNo = currentGameNo;
    else if (gameNoUpdate == "increase") currentGameNo++;
    else if (gameNoUpdate == "reset") currentGameNo = 1;
    else currentGameNo = parseInt(gameNoUpdate);

    // Game
    if (gameUpdate == null || gameUpdate == undefined) currentGame = currentGame;
    else currentGame = gameUpdate;

    // First Place
    if (firstUpdate == null || firstUpdate == undefined) currentFirstPlace = currentFirstPlace;
    else currentFirstPlace = firstUpdate;

    // Second Place
    if (secondUpdate == null || secondUpdate == undefined) currentSecondPlace = currentSecondPlace;
    else currentSecondPlace = secondUpdate;

    // Set back
    setGameNumber(currentGameNo);
    setGame(currentGame);
    setFirstPlace(currentFirstPlace);
    setSecondPlace(currentSecondPlace);

    // Get the current data
    const data = getOverlayData();

    return NextResponse.json(data);
}