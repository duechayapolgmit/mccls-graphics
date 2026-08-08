import { getConfig, getConfigColours } from "@/lib/client/config";
import { apiFetch, hexToRGBA } from "@/lib/utils/utils";
import { useEffect, useState } from "react";

const config = await getConfig();
const colours = await getConfigColours();

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
            // Configures highlighting
            let bgColour = hexToRGBA(colours.black, 0.75)
            let textColour = colours.white;
            if (index == currentGameNumber - 1) {
                bgColour = hexToRGBA(colours.highlight, 0.75);
                textColour = colours.black;
            }

            return (
                <div key={index} className="flex flex-col gap-1 w-[60px]
                                            font-metropolis-black text-white text-center text-3xl">
                    <div className="bg-colour text-colour" style={{'--bg-colour': bgColour, '--text-colour': textColour} as React.CSSProperties}>{index + 1}</div>
                    {game ? 
                        <img className="h-[60px] p-1 bg-colour" style={{'--bg-colour': bgColour} as React.CSSProperties} src={gameData?.[game]?.icon} /> : 
                        <div className="h-[60px] bg-colour" style={{'--bg-colour': bgColour} as React.CSSProperties}>{" "}</div>}
                    <div className="bg-colour text-colour text-2xl" style={{'--bg-colour': bgColour, '--text-colour': textColour} as React.CSSProperties}>{config?.event.multipliers[index]}</div>
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