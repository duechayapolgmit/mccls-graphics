'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import config from '@/config/general.json'
import styles from './break.module.css'

import BreakScreenBody from './_body';

import { getDisplayOption, getSubtitle, getTitle } from '@/lib/client/breakInfo';

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
                {/* PHASE 2 STUFF */}
                {/*<div className={styles.right_text}>1:00</div>
                <div className={`${styles.icon} ${styles.right_icon}`} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>*/}
            </div>
            <Body screen={state.currentScreen}/>
            <div className={styles.footer}>
                <div className={`${styles.left_text} ${getDisplayOption(state.currentScreen, "footer_event_name") ? "" : "hidden"}`}>
                    <div className={styles.icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>
                    <div className={styles.header_text}>{config.info.event_name}: <span className='text-colour' style={{"--text-colour": config.colours.highlight} as React.CSSProperties}>{config.info.tagline}</span></div>
                </div>
                <div className={styles.right_logo}><img src={"/logo-long.png"}/></div>
                <div className={`${styles.icon} ${styles.right_icon}`} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>        
            </div>
        </div>
    )
}

function Body({screen}: {screen: string}) {
    const [prev, setPrev] = useState("");
    const [out, setOut] = useState(false);

    useLayoutEffect(() => {
        setOut(true);

        const timeout = setTimeout(() => {
            setOut(false);
            const anotherTimeout = setTimeout(() => {setPrev(screen)}, 1000)
            return () => clearTimeout(anotherTimeout)
        }, 500);

        return () => clearTimeout(timeout);
    }, [screen])

    return (
        <div className={styles.body}>
            <div className={`${styles.body_mask} ${out ? 'mask-static' : 'transition-wipe mask-up'}`}>
                <BreakScreenBody screen={prev} />
            </div>
            <div className={`${styles.body_mask} ${out ? 'mask-down' : 'transition-wipe mask-static'}`}>
                <BreakScreenBody screen={screen} />
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
        const paddingLeft = parseFloat(styles.paddingLeft) + 0.5; // +1 because silly overflows
        const paddingRight = parseFloat(styles.paddingRight);

        const newWidth = textWidth + paddingLeft + paddingRight;
        const oldWidth = wrapperRef.current.offsetWidth;

        // if new text is longer than the old text, expand the width first then slide
        if (newWidth > oldWidth) wrapperRef.current.style.width = newWidth + "px";

        // starts the animation
        setOut(true);

        // set back
        const timeout = setTimeout(() => {
            setOut(false);

            // if new text shorter than the old text, shrink after the slide and when it's visible
            if (newWidth <= oldWidth && wrapperRef.current) {
                setTimeout(() => {
                    wrapperRef.current!.style.width = newWidth + "px";
                }, 1000)
            }

            const anotherTimeout = setTimeout(() => {setPrev({title, subtitle})}, 1000)
            return () => clearTimeout(anotherTimeout)
        }, 500);

        return () => clearTimeout(timeout);
    }, [title, subtitle]);

    return (
        <div className={`${styles.header_text} transition-width-fast`} ref={wrapperRef}>
            {/* PREVIOUS */}
            <div className={out ? '' : 'transition-slide-fast slide-up-out'}>
                {prev.title} <span className={styles.subtitle}>{prev.subtitle}</span>
            </div>
            {/* CURRENT */}
            <div className={out ? 'slide-up-ready' : 'transition-slide-fast slide-up-out' } ref={nextRef}>
                {title} <span className={styles.subtitle}>{subtitle}</span>
            </div>
            {/* MEASURE CURRENT TEXT */}
            <div className={styles.measure} ref={measureRef}>
                {title} <span className={styles.subtitle}>{subtitle}</span>
            </div>

        </div>
    )
}