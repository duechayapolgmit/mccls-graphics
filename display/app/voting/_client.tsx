'use client'
import { useEffect, useState } from 'react';

import styles from './voting.module.css'
import { EventProgress } from '@/components/client/event/progress';

export default function VotingClient({gameData}: {gameData: any}) {
    const [data, setData] = useState<any>(null);
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

    const slotDisplay = (slots: {slot: number, game: string, chosen: boolean}[]) => {
        if (!slots) return;
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
            <div className={data?.visible ? `${styles.games} transition slide-right-in flex-none h-[980px]` : `${styles.games} transition ${styles.games_slide_out} flex-none h-[980px]`}>
                 {slotDisplay(data?.slots)}
            </div>
            <div className='flex flex-col justify-end items-center w-[1900px]'>
                <div>
                    <EventProgress games={gameHistoryData} currentGameNumber={data?.voting_game_number}/>
                </div>
                {/*<div className='absolute content-center h-[136px]'>
                    <Announcement text={"NEW GAME ARriving"} textColour={"white"} colour={"#a78d00"}/>
                </div> */}
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

function Announcement({text, textColour, colour}: {text: string, textColour: string, colour: string}) {
    return (
        <div className='h-[100px] w-[750px] content-center text-center
                        font-metropolis-black uppercase text-5xl'
             style={{backgroundColor: colour, color: textColour}}>
            {text}
        </div>
    )
}