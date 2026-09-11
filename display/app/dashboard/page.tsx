'use client'
import CurrentStandings from "@/components/client/break/current_standings";
import { EventProgress } from "@/components/client/event/progress";
import { useStateGameHistory, useStateStatus } from "@/components/providers/stateProvider";

export default function Page() {
    const gameData = useStateGameHistory();
    const eventData = useStateStatus();

    return (
        <div className="p-2.5">
            <div className="font-metropolis-black text-6xl text-white">CURRENT STANDINGS</div>
            <CurrentStandings/>
            <div className="pt-2.5 font-metropolis-black text-6xl text-white">GAME HISTORY</div>
            <EventProgress games={gameData} currentGameNumber={eventData?.game_number}/>
        </div>
    )
}