'use client'
import { useEffect, useState } from 'react';

import styles from './voting.module.css'
import { EventProgress } from '@/components/client/event/progress';
import { apiFetch, FadeStack, TextFormatter } from '@/lib/utils/utilsComp';

export default function VotingClient({gameData}: {gameData: any}) {
    const [data, setData] = useState<any>(null);
    const [gameHistoryData, setGameHistoryData] = useState<any>(null);
    const [announcementData, setAnnouncementData] = useState<any>(null);
    const [activeAnnouncementId, setActiveAnnouncementId] = useState("event_progress");

    const belowScreenElementsIdList = [{id: "event_progress"}, ...(announcementData || [])]
    const belowScreenActiveIndex = belowScreenElementsIdList.findIndex(c => c.id === activeAnnouncementId) ?? 0

    // SSE Subscribe - api/voting
    useEffect(() => {
        // Register SSE
        const evtSrc = new EventSource('/api/voting/subscribe')

        evtSrc.onmessage = (e) => {
            const evtData = JSON.parse(e.data)
            setData(evtData)

            if (evtData.below_screen) setActiveAnnouncementId(evtData.below_screen);
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
        apiFetch('voting_data').then(async res => {
            const json = await res.json();
            setAnnouncementData(json);
        });
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

    const belowScreenReady = gameHistoryData && announcementData && data;

    return (
        <div className='flex pt-12.5 pl-12.5'>
            <div className={data?.visible ? `${styles.games} transition slide-right-in flex-none h-[980px]` : `${styles.games} transition ${styles.games_slide_out} flex-none h-[980px]`}>
                 {slotDisplay(data?.slots)}
            </div>
            <div className='flex flex-col justify-end items-center content-center w-[1900px]'>
                <FadeStack className="items-center content-center" active={belowScreenActiveIndex}>
                    <div className="h-[140px]" id="event_progress" >
                        <EventProgress games={gameHistoryData} currentGameNumber={data?.voting_game_number}/>
                    </div>
                    {announcementData?.map((ele: any) => (
                        <Announcement key={ele.id} id={ele.id} text={ele.text} textColour={ele.text_colour} bgColour={ele.bg_colour}/>
                    ))}
                </FadeStack>
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

function Announcement({id, text, textColour, bgColour}: {id: string, text: string, textColour: string, bgColour: string}) {
    return (
        <div className='h-[100px] w-[750px] content-center text-center
                        font-metropolis uppercase text-5xl'
             style={{backgroundColor: bgColour, color: textColour}}>
            <TextFormatter text={text}/>
        </div>
    )
}