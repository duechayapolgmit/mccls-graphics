export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { newStream } from "@/lib/transmitter/helper";
import { getGames, getPlacements } from "@/lib/server/eventProgressHandler";
import { getStateData } from "@/lib/server/breakHandler"; 
import { getOverlayData } from "@/lib/server/overlayHandler";
import { getEventStatus } from "@/lib/server/eventProgressHandler";
import { getVotingData } from "@/lib/server/votingHandler";

export async function GET() {
    const fullJson = {
        placements: getPlacements(),
        break: getStateData(),
        overlay: getOverlayData(),
        status: getEventStatus(),
        game_history: getGames(),
        voting: await getVotingData()
    }
    return newStream(fullJson, "general")
}