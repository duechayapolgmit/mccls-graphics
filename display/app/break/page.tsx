'use client'
import { useEffect, useState } from 'react';

import config from '@/config/general.json'

import styles from './break.module.css'

import BreakScreenBody from './_body';

import { getSubtitle, getTitle } from '@/lib/client/breakInfo';

export default function Page() {
    const [state, setState] = useState({
        currentScreen: ""
    })

    useEffect(() => {
        // Register SSE
        const evtSrc = new EventSource('/api/break/subscribe')

        evtSrc.onmessage = (e) => {
            const evtData = JSON.parse(e.data)
            setState(evtData)
        }

        return () => evtSrc.close();
    }, []);

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                <div className={styles.header_text}>{getTitle(state.currentScreen)} <span className={styles.subtitle}>{getSubtitle(state.currentScreen)}</span></div>
                <div className={styles.right_text}>1:00</div>
                <div className={`${styles.icon} ${styles.right_icon}`} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>
            </div>
            <BreakScreenBody screen={state.currentScreen} />
            <div className={styles.footer}>
                <div className={styles.icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>
                <div className={styles.header_text}>{config.info.event_name}: <span className='text-colour' style={{"--text-colour": config.colours.highlight} as React.CSSProperties}>{config.info.tagline}</span></div>
                <div className={styles.right_logo}><img src={"/logo-long.png"}/></div>
                <div className={`${styles.icon} ${styles.right_icon}`} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>        
            </div>
        </div>
    )
}