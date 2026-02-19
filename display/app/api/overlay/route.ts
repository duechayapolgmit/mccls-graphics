import { NextResponse, type NextRequest } from "next/server";
import {resetOverlay, setGameNumber, getGameNumber, getOverlayData, getGame, setGame, getFirstPlace, getSecondPlace, setFirstPlace, setSecondPlace, getFirstDBPoints, getSecondDBPoints, setFirstDBPoints, setSecondDBPoints, getStatusDisplayOptions, getPlacementsDisplayOptions, setStatusDisplayOptions, setPlacementsDisplayOptions} from '@/lib/overlay/overlayInfo';

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameNoUpdate = searchParams.get('gameNo')
    const gameUpdate = searchParams.get('game')
    const firstUpdate = searchParams.get('first')
    const secondUpdate = searchParams.get('second')
    const dbActivateUpdate = searchParams.get('dodgebolt')
    const firstDB = searchParams.get('firstDB')
    const secondDB = searchParams.get('secondDB')
    const statusVisibleUpdate = searchParams.get('status')
    const placementsVisibleUpdate = searchParams.get('placements')
    const reset = searchParams.get('reset');

    // Current info
    let currentGameNo = getGameNumber();
    let currentGame = getGame();
    let currentFirstPlace = getFirstPlace();
    let currentSecondPlace = getSecondPlace();
    let currentFirstDB = getFirstDBPoints();
    let currentSecondDB = getSecondDBPoints();
    let currentStatusVisible = getStatusDisplayOptions();
    let currentPlacementsVisible = getPlacementsDisplayOptions();
    
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

    // Dodgebolts overlay activate
    if (dbActivateUpdate == "true") {
        currentFirstDB = 0;
        currentSecondDB = 0;
    }

    // First place DB points
    if (firstDB == null || firstDB == undefined) currentFirstDB = currentFirstDB;
    else if (firstDB == "increase") currentFirstDB++;
    else currentFirstDB = parseInt(firstDB);

    // Second place DB points
    if (secondDB == null || secondDB == undefined) currentSecondDB = currentSecondDB;
    else if (secondDB == "increase") currentSecondDB++;
    else currentSecondDB = parseInt(secondDB);
    
    // Visibility
    if (statusVisibleUpdate == "show") currentStatusVisible = true;
    else if (statusVisibleUpdate == "hide") currentStatusVisible = false;

    if (placementsVisibleUpdate == "show") currentPlacementsVisible = true;
    else if (placementsVisibleUpdate == "hide") currentPlacementsVisible = false;

    // Set back
    setGameNumber(currentGameNo);
    setGame(currentGame);
    setFirstPlace(currentFirstPlace);
    setSecondPlace(currentSecondPlace);
    setFirstDBPoints(currentFirstDB);
    setSecondDBPoints(currentSecondDB);
    setStatusDisplayOptions(currentStatusVisible);
    setPlacementsDisplayOptions(currentPlacementsVisible);

    // RESET
    if (reset == "true") resetOverlay();

    // Get the current data
    const data = getOverlayData();

    return NextResponse.json(data);
}