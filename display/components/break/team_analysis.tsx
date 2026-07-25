import { apiFetch, getOrdinal } from "@/lib/utils/utils";
import { TextFormatter } from "@/lib/utils/utilsComp";
import { useEffect, useState } from "react";

export function TeamAnalysis({team}: {team: string}){
    const [teamData, setTeamData] = useState<any>();
    const [gameData, setGameData] = useState<any>();

    useEffect(() => {
        apiFetch('teams/info').then(async res => {
            const json = await res.json();
            setTeamData(json);
        });
        apiFetch('games').then(async res => {
            const json = await res.json();
            setGameData(json);
        });
    }, [])

    return (
        <div className="flex flex-row gap-25">
            <img src={teamData?.[team].icon}/>
            <TeamDetails team={team} gameData={gameData}/>
        </div>
    )
}

function TeamDetails({team, gameData}: {team: string, gameData: any}) {
    const [teamData, setTeamData] = useState<any>();

    useEffect(() => {
        apiFetch('break_data/team_analysis').then(async res => {
            const json = await res.json();
            setTeamData(json);
        });
    }, [])

    const getBestGames = (teamGameData: Record<string, number>): string => {
        if (!teamGameData) return "";

        const entries = Object.entries(teamGameData);
        const min = Math.min(...entries.map(([_, val]) => val));
        
        const bestGames = entries.filter(([_, val]) => val === min)
                                 .map(([key]) => key);

        if (bestGames.length == 1) return gameData?.[bestGames[0]].name.toUpperCase();
        return bestGames.join("/");
    }

    const getGameDetails = (teamGameData: Record<string, number>) => {
        if (!teamGameData) return;

        const entries = Object.entries(teamGameData);
        const entriesMap = entries.map(([game, place]) => {
            return (
                <div key={game} className="grid grid-cols-[750px_100px]">
                    <div className="font-metropolis-black">
                        {`${gameData?.[game].name.toUpperCase()}:`}
                    </div>
                    <div className="justify-items-end">
                        {getOrdinal(place)}
                    </div>
                </div>
            )
        })

        return (
            <div className="">
                {entriesMap}
            </div>
        )
    }

    return (
        <div className="font-metropolis text-white text-5xl">
            <div className="flex flex-col pb-5">
                <TextFormatter text={`<b>OVERALL</b>: ${getOrdinal(teamData?.[team].overall.placement)} (${teamData?.[team].overall.average})`}/>
                <TextFormatter text={`<b>BEST GAME(S)</b>: ${getBestGames(teamData?.[team].games)}`}/>
            </div>
            <div className="w-212.5 border-t-2 border-white pt-5">
                {getGameDetails(teamData?.[team].games)}
            </div>
        </div>
    )
}