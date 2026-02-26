import { NextResponse, type NextRequest } from "next/server";
import {resetOverlay, setGameNumber, getGameNumber, getOverlayData, getGame, setGame, getStatusDisplayOptions, getPlacementsDisplayOptions, setStatusDisplayOptions, setPlacementsDisplayOptions, getPlacements, setPlaceName, setPlaceScore} from '@/lib/overlay/overlayInfo';
import { Truculenta } from "next/font/google";

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
    let currentPlacements = getPlacements();
  
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

        setGameNumber(currentGameNo)
    }

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
    if (statusVisibleUpdate) {
        if (statusVisibleUpdate == "show") setStatusDisplayOptions(true);
        else if (statusVisibleUpdate == "hide") setStatusDisplayOptions(false);
    }

    if (placementsVisibleUpdate) {
        if (placementsVisibleUpdate == "show") setPlacementsDisplayOptions(true);
        else if (placementsVisibleUpdate == "hide") setPlacementsDisplayOptions(false);
    }

    // RESET
    if (reset == "true") resetOverlay();

    // Get the current data
    const data = getOverlayData();

    return NextResponse.json(data);
}