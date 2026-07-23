import { NextResponse, type NextRequest } from "next/server";
import {resetOverlay, setGameNumber, getGameNumber, getOverlayData, setGame, setStatusDisplayOptions, setPlacementsDisplayOptions, setForcedSideOptions} from '@/lib/server/overlayHandler';
import { notify } from "@/lib/transmitter/listeners";

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const forceOverlaySide = searchParams.get('forcedSide')
    const gameNoUpdate = searchParams.get('gameNo')
    const gameUpdate = searchParams.get('game')
    const statusVisibleUpdate = searchParams.get('status')
    const placementsVisibleUpdate = searchParams.get('placements')
    const reset = searchParams.get('reset');

    // Current info
    let changed = false;

    // Forced Overlay Sides
    if (forceOverlaySide) changed = setForcedSideOptions(forceOverlaySide);
  
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