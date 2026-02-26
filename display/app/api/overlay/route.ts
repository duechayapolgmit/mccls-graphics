import { NextResponse, type NextRequest } from "next/server";
import {resetOverlay, setGameNumber, getGameNumber, getOverlayData, getGame, setGame, getStatusDisplayOptions, getPlacementsDisplayOptions, setStatusDisplayOptions, setPlacementsDisplayOptions, getPlacements, setPlaceName, setPlaceScore} from '@/lib/overlay/overlayInfo';

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameNoUpdate = searchParams.get('gameNo')
    const gameUpdate = searchParams.get('game')

    const placeUpdate = searchParams.get('place')
    const placeNameUpdate = searchParams.get('placeName')
    const placeScoreUpdate = searchParams.get('placeScore')

    const dbActivateUpdate = searchParams.get('dodgebolt')
    const statusVisibleUpdate = searchParams.get('status')
    const placementsVisibleUpdate = searchParams.get('placements')
    const reset = searchParams.get('reset');

    // Current info
    let currentGameNo = getGameNumber();

    let currentPlacements = getPlacements();

    let currentStatusVisible = getStatusDisplayOptions();
    let currentPlacementsVisible = getPlacementsDisplayOptions();
    
    // Game Number
    if (gameNoUpdate == null || gameNoUpdate == undefined) currentGameNo = currentGameNo;
    else if (gameNoUpdate == "increase") currentGameNo++;
    else if (gameNoUpdate == "reset") currentGameNo = 1;
    else currentGameNo = parseInt(gameNoUpdate);

    // Game
    if (gameUpdate) setGame(gameUpdate);

    // Placements
    if (placeUpdate && placeNameUpdate) { // Name
        setPlaceName(parseInt(placeUpdate), placeNameUpdate);
    }

    if (placeUpdate && placeScoreUpdate) { // Score
        let place = parseInt(placeUpdate)
        if (currentPlacements[place - 1]) {
            if (placeScoreUpdate == "increase") setPlaceScore(place, currentPlacements[place -1].score + 1);
            else setPlaceScore(place, parseInt(placeScoreUpdate))
        }
    }

    // Dodgebolts overlay activate
    if (dbActivateUpdate == "true") {
        let placementsCount = currentPlacements.length;
        for (let i = 0; i < placementsCount; i++) {
            setPlaceScore(i+1, 0)
        }
    }
    
    // Visibility
    if (statusVisibleUpdate == "show") currentStatusVisible = true;
    else if (statusVisibleUpdate == "hide") currentStatusVisible = false;

    if (placementsVisibleUpdate == "show") currentPlacementsVisible = true;
    else if (placementsVisibleUpdate == "hide") currentPlacementsVisible = false;

    // Set back
    setGameNumber(currentGameNo);
    setStatusDisplayOptions(currentStatusVisible);
    setPlacementsDisplayOptions(currentPlacementsVisible);

    // RESET
    if (reset == "true") resetOverlay();

    // Get the current data
    const data = getOverlayData();

    return NextResponse.json(data);
}