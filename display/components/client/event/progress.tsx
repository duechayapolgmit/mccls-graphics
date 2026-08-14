import { useConfig } from "@/components/providers/configProvider";
import { apiFetch, hexToRGBA } from "@/lib/utils/utils";
import { FadeStack } from "@/lib/utils/utilsComp";
import { useEffect, useState } from "react";

export function EventProgress({games, currentGameNumber}: {games: string[], currentGameNumber: number}) { 
    const config = useConfig().general;
    const colours = useConfig().colours;

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

            const bgHighlight = hexToRGBA(colours.highlight, 0.75)
            const bgBlack = hexToRGBA(colours.black, 0.75)
            const bgColour = highlighted ? bgHighlight : bgBlack;
            
            const textColour = highlighted ? colours.black : colours.white;

            return (
                <div key={index} className="flex flex-col gap-1 w-[60px]
                                            font-metropolis-black text-center text-3xl"
                                 style={{'--bg-colour': bgColour, '--text-colour': textColour} as React.CSSProperties}>
                    <FadeStack active={highlighted ? 1 : 0}>
                        <div style={{backgroundColor: bgBlack, color: colours.white}}>{index + 1}</div>
                        <div style={{backgroundColor: bgHighlight, color: colours.black}}>{index + 1}</div>
                    </FadeStack>
                    <FadeStack active={highlighted ? 1 : 0}>
                        <div style={{backgroundColor: bgBlack, color: colours.black}}><img className="h-[60px] p-1" src={gameData?.[game]?.icon} /></div>
                        <div style={{backgroundColor: bgHighlight, color: colours.black}}><img className="h-[60px] p-1" src={gameData?.[game]?.icon} /></div>
                    </FadeStack>
                     <FadeStack active={highlighted ? 1 : 0} className="text-2xl">
                        <div style={{backgroundColor: bgBlack, color: colours.white}}>{config?.event.multipliers[index]}</div>
                        <div style={{backgroundColor: bgHighlight, color: colours.black}}>{config?.event.multipliers[index]}</div>
                     </FadeStack>
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