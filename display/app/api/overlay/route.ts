import { NextResponse, type NextRequest } from "next/server";
import { resetOverlay, getOverlayData, setGame, setStatusDisplayOptions, setPlacementsDisplayOptions, setForcedSideOptions } from '@/lib/server/overlayHandler';
import { notifyState } from "@/lib/transmitter/listeners";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const forceOverlaySide = searchParams.get('forcedSide')
    const gameUpdate = searchParams.get('game')
    const statusVisibleUpdate = searchParams.get('status')
    const placementsVisibleUpdate = searchParams.get('placements')
    const reset = searchParams.get('reset');

    // Current info
    let changed = false;

    // Forced Overlay Sides
    if (forceOverlaySide) changed = setForcedSideOptions(forceOverlaySide);

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
    if (reset == "true") changed = await resetOverlay();

    if (changed) notifyState();

    return NextResponse.json(getOverlayData());
}