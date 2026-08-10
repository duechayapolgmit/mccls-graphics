import { NextResponse, type NextRequest } from "next/server";
import { notify } from "@/lib/transmitter/listeners";
import { getEventStatus, getPlacements, getStateData, resetEvent } from "@/lib/server/eventProgressHandler";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Read from queries
    const reset = searchParams.get('reset');

    // RESET
    if (reset == "true") {
        resetEvent();
        notify(await getEventStatus(), "event_status");
        notify(await getPlacements(), "event_placements");
        return NextResponse.json({status: 200});
    } else {
        return NextResponse.json({error: 'Method Not Allowed', status: 405});
    }
}