import { getConfigColours } from "@/lib/client/config";
import { hexToRGBA } from "@/lib/utils/utils";

import styles from '@/components/list.module.css'

const colours = await getConfigColours();

export function ListEntry({rank, body}: {rank: number, body: any}) {
    const getRank = (rank: number) => {
        const getColour = () => {
            switch(rank) {
                case 1: return hexToRGBA(colours.gold, 0.75)
                case 2: return hexToRGBA(colours.silver, 0.75)
                case 3: return hexToRGBA(colours.bronze, 0.75)
                default: return hexToRGBA(colours.black, 0.75)
            }
        }
        
        return (
            <div className="flex w-[70px] bg-black/75 justify-center
                            font-metropolis-black text-[50px] text-white text-center leading-[70px] bg-colour"
                 style={{'--bg-colour': getColour()} as React.CSSProperties}>
                <span className="list-rank-text">{rank}</span>
            </div>
        )
    };

    return (
        <div className={`flex flex-row gap-[10px] ${styles.body}`}>
            {getRank(rank)}
            {body}
        </div>
    )
}