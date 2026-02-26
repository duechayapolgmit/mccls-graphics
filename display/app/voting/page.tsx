'use client'
import { useEffect, useState } from 'react';
import styles from './voting.module.css'

export default function Page() {
    const [data, setData] = useState({
        slots: [{
            slot: 0, 
            game: ""
        }]
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
    
    const slotDisplay = (slots: {slot: number, game: string}[]) => {
        const lst = slots.map((slot: {slot: number, game: string}) => {
            return (<GameSlot key={slot.slot}/>)
        })
        return (
            <div>
                {lst}
            </div>
        )
    }

    return (
        <div>
            <div className={styles.games}>
                 {slotDisplay(data.slots)}
            </div>
           
        </div>
        
    )
}

function GameSlot() {
    return (
        <div className={styles.game}>
            
        </div>
    )
}