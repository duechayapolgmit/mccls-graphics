import { hexToRGBA } from "@/lib/utils/utils";

import styles from './list.module.css'
import { useConfig } from "../providers/configProvider";

export function ListEntry({rank, body, currentStandings = false}: {rank: number, body: any, currentStandings?: boolean}) {
    const config = useConfig().general;
    const colours = useConfig().colours;

    const getRank = (rank: number) => {
        const getColour = () => {
            if (currentStandings) {
                const inFinale = rank <= config.info.final_teams
                return hexToRGBA(inFinale ? colours?.highlight : colours?.primary, 0.75)
            }

            // podium colours
            const podiumColours: any = {
                1: colours?.gold,
                2: colours?.silver,
                3: colours?.bronze
            }
            const selectedColour = podiumColours[rank] ?? colours?.black
            return hexToRGBA(selectedColour, 0.75)
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