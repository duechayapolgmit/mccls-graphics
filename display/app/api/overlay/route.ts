import { NextResponse, type NextRequest } from "next/server";
import {resetOverlay, setGameNumber, getGameNumber, getOverlayData, setGame, setStatusDisplayOptions, setPlacementsDisplayOptions, getPlacements, setPlaceName, setPlaceScore} from '@/lib/server/overlayHandler';
import { notify } from "@/lib/transmitter/listeners";

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const gameNoUpdate = searchParams.get('gameNo')
    const gameUpdate = searchParams.get('game')

    const placeUpdate = searchParams.get('place')
    const placeNameUpdate = searchParams.get('placeName')
    const placeScoreUpdate = searchParams.get('placeScore') || searchParams.get('score')

    const dbActivateUpdate = searchParams.get('dodgebolt')
    const statusVisibleUpdate = searchParams.get('status')
    const placementsVisibleUpdate = searchParams.get('placements')
    const reset = searchParams.get('reset');

    // Current info
    let currentPlacements = getPlacements();
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

    // Game
    if (gameUpdate) changed = setGame(gameUpdate);

    // Placements
    if (placeUpdate && placeNameUpdate) { // Name
        changed = setPlaceName(parseInt(placeUpdate), placeNameUpdate);
    }

    if (placeUpdate && placeScoreUpdate) { // Score
        let place = parseInt(placeUpdate)
        if (currentPlacements[place - 1]) {
            if (placeScoreUpdate == "increase") changed = setPlaceScore(place, currentPlacements[place -1].score + 1);
            else changed = setPlaceScore(place, parseInt(placeScoreUpdate))
        }
    }

    // Dodgebolts overlay activate
    if (dbActivateUpdate == "true") {
        let placementsCount = currentPlacements.length;
        for (let i = 0; i < placementsCount; i++) {
            changed = setPlaceScore(i+1, 0)
        }
    }
    
    // Visibility
    if (statusVisibleUpdate) {
        if (statusVisibleUpdate == "show") changed = setStatusDisplayOptions(true);
        else if (statusVisibleUpdate == "hide") changed = setStatusDisplayOptions(false);
    }

    if (placementsVisibleUpdate) {
        if (placementsVisibleUpdate == "show") changed = setPlacementsDisplayOptions(true);
        else if (placementsVisibleUpdate == "hide") changed = setPlacementsDisplayOptions(false);
    }

    // RESET
    if (reset == "true") changed = resetOverlay();

    if (changed) notify(getOverlayData(), "overlay");

    return NextResponse.json(getOverlayData());
}