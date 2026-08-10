import { getConfig } from "@/lib/server/config";
import { apiFetch, hexToRGBA } from "@/lib/utils/utils";
import { useEffect, useState } from "react";

const config = await getConfig();
const colours = await getConfig("colours");

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
            const highlighted = index == currentGameNumber - 1;

            const bgColour = highlighted ? hexToRGBA(colours.highlight, 0.75) : hexToRGBA(colours.black, 0.75);
            const textColour = highlighted ? colours.black : colours.white;

            return (
                <div key={index} className="flex flex-col gap-1 w-[60px]
                                            font-metropolis-black text-center text-3xl"
                                 style={{'--bg-colour': bgColour, '--text-colour': textColour} as React.CSSProperties}>
                     <FadeBox active={highlighted}>
                        {index + 1}
                    </FadeBox>
                     <FadeBox active={highlighted}>
                        <img className="h-[60px] p-1" src={gameData?.[game]?.icon} />
                     </FadeBox>
                     <FadeBox active={highlighted} className="text-2xl">
                        {config?.event.multipliers[index]}
                     </FadeBox>
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

// TODO: Refactor this to support multiple colours (probably for team labels)
function FadeBox({active, className = "", children}: {active: boolean, className?: string, children: React.ReactNode}) {
    const activeBg = hexToRGBA(colours.highlight, 0.75);
    const inactiveBg = hexToRGBA(colours.black, 0.75);

    const activeText = colours.black;
    const inactiveText = colours.white;

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 transition-opacity duration-500"
                 style={{backgroundColor: activeBg, opacity: active ? 1 : 0}}/>
            <div className="absolute inset-0 transition-opacity duration-500"
                 style={{backgroundColor: inactiveBg, opacity: active ? 0 : 1}}/>
            <div className="relative z-10 font-metropolis-black">
                <div className="transition-opacity duration-500 font-metropolis-black"
                     style={{color: activeText, opacity: active ? 1 : 0}}>{children}</div>
                <div className="absolute transition-opacity inset-0 duration-500 font-metropolis-black"
                     style={{color: inactiveText, opacity: active ? 0 : 1}}>{children}</div>                
            </div>
        </div>
    )
}