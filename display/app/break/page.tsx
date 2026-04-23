'use client'
import { useEffect, useState } from 'react';

import styles from './break.module.css'

import config from '@/config/general.json'
import configBreakCardList from '@/config/break-card_list.json'

import CardGrid from '@/components/break/card_grid';
import { getCardGridList, getSubtitle, getTitle, getType } from '@/lib/client/breakInfo';
import { resolveRule } from '@/lib/utils';
import WinsLeaderboard from '@/components/break/wins_leaderboard';
import { getWinsLeaderboard, getWinsLeaderboardFromAmount } from '@/lib/server/wins';


export default function Page() {
    const [state, setState] = useState({
        currentScreen: ""
    })
    const [cardLst, setCardLst] = useState([]);
    const [contentScale, setContentScale] = useState(1);

    useEffect(() => {
        // Register SSE
        const evtSrc = new EventSource('/api/break/subscribe')

        evtSrc.onmessage = (e) => {
            const evtData = JSON.parse(e.data)
            setState(evtData)
        }

        return () => evtSrc.close();
    }, []);

    useEffect(() => {
        const lst = getCardGridList(state.currentScreen);
        setCardLst(lst);
        
        const scale = getScaleSize(lst);
        setContentScale(scale);
    }, [state.currentScreen])

    const getBodyContent = () => {
        switch(getType(state.currentScreen)) {
            case "card_grid":
                if (!cardLst) return null; // prevents error
                return <CardGrid key={state.currentScreen} lst={cardLst}/>
            case "wins_leaderboard":
                return <WinsLeaderboard key={state.currentScreen} playersWins={getWinsLeaderboardFromAmount(config.break_screen.minimum_wins)}/>
            default:
                return null;
        }
    }

    const getScaleSize = (lst: []) => {
        if (!lst) return 1;

        const items = lst.length;
        return Number(resolveRule(configBreakCardList.scale, items));
    };

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                <div className={styles.header_text}>{getTitle(state.currentScreen)} <span className={styles.subtitle}>{getSubtitle(state.currentScreen)}</span></div>
                <div className={styles.right_text}>1:00</div>
                <div className={`${styles.icon} ${styles.right_icon}`} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>
            </div>
            <div className={styles.body}>
                <div className={styles.content_cards} style={{"--scale": contentScale} as React.CSSProperties}>
                    {getBodyContent()}
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>
                <div className={styles.header_text}>{config.info.event_name}: <span className='text-colour' style={{"--text-colour": config.colours.highlight} as React.CSSProperties}>{config.info.tagline}</span></div>
                <div className={styles.right_logo}><img src={"/logo-long.png"}/></div>
                <div className={`${styles.icon} ${styles.right_icon}`} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>        
            </div>
        </div>
    )
}