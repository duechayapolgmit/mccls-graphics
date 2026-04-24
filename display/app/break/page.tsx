'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

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
                <Title title={getTitle(state.currentScreen)} subtitle={getSubtitle(state.currentScreen)}/>
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

function Title({title, subtitle}: {title: string, subtitle: string}) {
    const [prev, setPrev] = useState({title: "‎", subtitle});
    const [out, setOut] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!wrapperRef.current || !nextRef.current) return; // no undefines

        // Measure widths
        const textWidth = measureRef.current?.offsetWidth || 0;
        const styles = getComputedStyle(wrapperRef.current);
        const paddingLeft = parseFloat(styles.paddingLeft) + 1; // +1 because silly overflows
        const paddingRight = parseFloat(styles.paddingRight);

        const newWidth = textWidth + paddingLeft + paddingRight;
        const oldWidth = wrapperRef.current.offsetWidth;

        if (newWidth > oldWidth) { // if new text is longer than the old text, expand the width first then slide
            wrapperRef.current.style.width = newWidth + "px";
            setOut(true);
        } else { // Else, slide first then reduce width
            setOut(true);
            setTimeout(() => {
                if (!wrapperRef.current) return;
                wrapperRef.current.style.width = newWidth + "px";
            }, 1500) // 1.5s to offset the transition.
        }

        // set back
        const timeout = setTimeout(() => {
            setOut(false);
            const anotherTimeout = setTimeout(() => {setPrev({title, subtitle})}, 1000)
            return () => clearTimeout(anotherTimeout)
        }, 1000);

        return () => clearTimeout(timeout);
    }, [title, subtitle]);

    return (
        <div className={`${styles.header_text} transition-width-fast`} ref={wrapperRef}>
            {/* PREVIOUS */}
            <div className={out ? '' : '.transition-transform-fast slide-up-out'}>
                {prev.title} <span className={styles.subtitle}>{prev.subtitle}</span>
            </div>
            {/* CURRENT */}
            <div className={out ? 'slide-up-ready' : '.transition-transform-fast slide-up-out' } ref={nextRef}>
                {title} <span className={styles.subtitle}>{subtitle}</span>
            </div>
            {/* MEASURE CURRENT TEXT */}
            <div className={styles.measure} ref={measureRef}>
                {title} <span className={styles.subtitle}>{subtitle}</span>
            </div>

        </div>
    )
}