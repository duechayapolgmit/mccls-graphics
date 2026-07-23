import { NextResponse, type NextRequest } from "next/server";
import { notify } from "@/lib/transmitter/listeners";
import { getPlacements, setPlaceName, setPlaceScore, resetEvent } from "@/lib/server/eventProgressHandler";

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const placeUpdate = searchParams.get('place')
    const placeNameUpdate = searchParams.get('placeName')
    const placeScoreUpdate = searchParams.get('placeScore') || searchParams.get('score')

    const dbActivateUpdate = searchParams.get('dodgebolt')
    const reset = searchParams.get('reset');

    // Current info
    let currentPlacements = getPlacements();
    let changed = false;

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

    // RESET
    if (reset == "true") changed = resetEvent();

    if (changed) notify(getPlacements(), "event_placements");

    return NextResponse.json(getPlacements());
}