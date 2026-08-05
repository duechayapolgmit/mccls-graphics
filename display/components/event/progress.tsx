import { getConfig } from "@/lib/client/config";
import { apiFetch } from "@/lib/utils/utils";
import { useEffect, useState } from "react";

const config = await getConfig();

export function EventProgress({games, currentGameNumber}: {games: string[], currentGameNumber: number}) {
    const [gameData, setGameData] = useState<any>();

    useEffect(() => {
        apiFetch('games').then(async res => {
            const json = await res.json();
            setGameData(json);
        });
    }, [])

    const getGames = () => {
        const gamesDivList = games?.map( (game, index) => {
            return (
                <div key={index} className="flex flex-col gap-1 w-[60px]
                                            font-metropolis-black text-white text-center text-3xl">
                    <div className="bg-black/75">{index + 1}</div>
                    {game ? <img className="h-[60px] p-1 bg-black/75" src={gameData?.[game]?.icon}/> : <div className="h-[60px] bg-black/75">{" "}</div>}
                    <div className="bg-black/75 text-2xl">{config?.event.multipliers[index]}</div>
                </div>
            )
        })
        return (
            <div className="flex flex-row gap-3">
                {gamesDivList}
            </div>
        )
    }
    return (
        <div className="">
            {getGames()}
        </div>
    )
}