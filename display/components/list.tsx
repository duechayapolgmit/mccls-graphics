import { getConfigColours } from "@/lib/client/config";
import { hexToRGBA } from "@/lib/utils/utils";

import styles from '@/components/list.module.css'

const colours = await getConfigColours();

export function ListEntry({rank, body, currentStandings = false}: {rank: number, body: any, currentStandings?: boolean}) {
    const getRank = (rank: number) => {
        const getColour = () => {
            switch(rank) {
                case 1: 
                    if (currentStandings) return hexToRGBA(colours.highlight, 0.75)
                    return hexToRGBA(colours.gold, 0.75)
                case 2: 
                    if (currentStandings) return hexToRGBA(colours.highlight, 0.75)
                    return hexToRGBA(colours.silver, 0.75)
                case 3: 
                    if (currentStandings) return hexToRGBA(colours.primary, 0.75)
                    return hexToRGBA(colours.bronze, 0.75)
                default: 
                    if (currentStandings) return hexToRGBA(colours.primary, 0.75)
                    return hexToRGBA(colours.black, 0.75)
            }
        }
        
        return (
            <div className="flex w-17.5 bg-black/75 justify-center
                            font-metropolis-black text-[50px] text-white text-center leading-17.5 bg-colour"
                 style={{'--bg-colour': getColour()} as React.CSSProperties}>
                <span className="list-rank-text">{rank}</span>
            </div>
        )
    };

    return (
        <div className={`flex flex-row gap-2.5 ${styles.body}`}>
            {getRank(rank)}
            {body}
        </div>
    )
}