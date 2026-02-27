'use client'
import { useEffect, useState } from 'react';
import styles from './voting.module.css'

import {getGameLogoPath} from '@/lib/gameInfo';

export default function Page() {
    const [data, setData] = useState({
        slots: [{
            slot: 0, 
            game: "",
            chosen: false
        }],
        visible: true
    });

    useEffect(() => {
        // syncing
        const fetcher = setInterval(async () => {
            const res = await fetch('/api/voting', { cache: "no-store"});
            const json = await res.json();
            setData(json);
        }, 1000);

        return () => clearInterval(fetcher);
    }, [])
    
    const slotDisplay = (slots: {slot: number, game: string, chosen: boolean}[]) => {
        const lst = slots.map((slot: {slot: number, game: string, chosen: boolean}) => {
            return (<GameSlot key={slot.slot} game={slot.game} chosen={slot.chosen}/>)
        })
        return (
            <div>
                {lst}
            </div>
        )
    }

    return (
        <div>
            <div className={data.visible ? `${styles.games} transition slide-in` : `${styles.games} transition ${styles.games_slide_out}`}>
                 {slotDisplay(data.slots)}
            </div>
           
        </div>
        
    )
}

function GameSlot({game, chosen} : {game: string, chosen: boolean}) {
    return (
        <div className={chosen ? `${styles.game} ${styles.game_chosen}` : `${styles.game} ${styles.game_unchosen}`}>
            <img src={getGameLogoPath(game)}/>
        </div>
    )
}