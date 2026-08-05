'use client'
import { useEffect, useState } from 'react';

import styles from './voting.module.css'
import { EventProgress } from '@/components/event/progress';

export default function VotingClient({gameData}: {gameData: any}) {
    const [data, setData] = useState({
        slots: [{
            slot: 0, 
            game: "",
            chosen: false
        }],
        visible: true
    });
    const [statusData, setStatusData] = useState<any>(null);
    const [gameHistoryData, setGameHistoryData] = useState<any>(null);

    useEffect(() => {
        // Register SSE
        const evtSrc = new EventSource('/api/voting/subscribe')

        evtSrc.onmessage = (e) => {
            const evtData = JSON.parse(e.data)
            setData(evtData)
        }

        return () => evtSrc.close();
    }, [])

    useEffect(() => {
        // Register SSE
        const evtSrc = new EventSource('/api/event/games/subscribe')

        evtSrc.onmessage = (e) => {
            const evtData = JSON.parse(e.data)
            setGameHistoryData(evtData)
        }

        return () => evtSrc.close();
    }, [])

    useEffect(() => {
        // Register SSE
        const evtSrc = new EventSource('/api/event/status/subscribe')

        evtSrc.onmessage = (e) => {
            const evtData = JSON.parse(e.data)
            setStatusData(evtData)
        }

        return () => evtSrc.close();
    }, [])

    const slotDisplay = (slots: {slot: number, game: string, chosen: boolean}[]) => {
        const lst = slots.map((slot: {slot: number, game: string, chosen: boolean}) => {
            return (<GameSlot key={slot.slot} gameData={gameData} game={slot.game} chosen={slot.chosen}/>)
        })
        return (
            <div>
                {lst}
            </div>
        )
    }

    return (
        <div className='flex pt-12.5 pl-12.5'>
            <div className={data.visible ? `${styles.games} transition slide-right-in flex-none h-[980px]` : `${styles.games} transition ${styles.games_slide_out} flex-none h-[980px]`}>
                 {slotDisplay(data.slots)}
            </div>
            <div className='flex flex-col justify-end items-center w-[1900px]'>
                <EventProgress games={gameHistoryData} currentGameNumber={statusData?.current_game_number}/>
            </div>
        </div>
        
    )
}

function GameSlot({gameData, game, chosen} : {gameData: any, game: string, chosen: boolean}) {
    return (
        <div className={chosen ? `${styles.game} ${styles.game_chosen}` : `${styles.game} ${styles.game_unchosen}`}>
            <img src={gameData?.[game]?.logo}/>
        </div>
    )
}