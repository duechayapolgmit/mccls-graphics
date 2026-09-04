'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import BreakScreenBody from './_body';

import { getDisplayOption, getType } from '@/lib/client/breakInfo';
import { TextFormatter } from '@/lib/utils/utilsComp';
import { Countdown } from '@/components/client/countdown';
import { apiFetch } from '@/lib/utils/utils';
import { useConfig } from '@/components/providers/configProvider';
import { useStateBreak } from '@/components/providers/stateProvider';

export default function Page() {
    const config = useConfig().general;
    const colours = useConfig().colours;

    const [breakData, setBreakData] = useState<any>(null);
    const state = useStateBreak();

    // Set up data
    useEffect(() => {
        apiFetch('break_data/screens').then(async res => {
            const json = await res.json();
            setBreakData(json);
        });
    }, [])

    // Screen change
    useEffect(() => {
        if (!state?.rotating) return;

        const screens = config?.break_screens.rotation.in_rotation;

        const interval = setInterval(() => {
            let nextScreen;

            if (config?.break_screens.rotation.random) {
                const availableScreens = screens.filter((s: any) => s != state?.currentScreen)
                const target = Math.floor(Math.random() * (availableScreens.length));
                nextScreen = availableScreens[target];
            } else {
                const index = screens.indexOf(state?.currentScreen);
                nextScreen = screens[(index + 1) % screens.length]
            }
            
            const params = new URLSearchParams();
            params.set("current", nextScreen);
            apiFetch("/break", params)
        }, config?.break_screens.rotation.rotate_time * 1000);

        return () => clearInterval(interval);
    }, [state?.rotating, state?.currentScreen])

    if (!breakData) return null;
    // CSS Constants
    const classIcons = "w-[100px] h-[60px] bg-(--bg-colour)"
    const classIconsImg = "w-[75px] -translate-y-[8px] ml-auto mr-auto"
    const classText = "relative px-[0.5em] bg-black/75 text-white text-[40px] text-center leading-[60px] uppercase overflow-hidden whitespace-nowrap"
    const classRightText = "ml-auto mr-0"

    return (
        <div className="mt-12.5 overflow-hidden">
            <div className="flex">
                <div className="w-[100px] h-[60px] bg-(--bg-colour)" style={{"--bg-colour": colours?.secondary} as React.CSSProperties}>
                    <img className={classIconsImg} src={"/icon-event.png"}/>
                </div>
                <Title screenData={breakData?.[state?.currentScreen]}/>
                {!state?.timeVisible ? "" :
                    <>
                        <div className={`${classText} ${classRightText} font-metropolis`}>
                            <Countdown key={state?.time} time={state?.time} showMinutes={true} warning={true}/>
                        </div>
                        <div className={`${classIcons} ml-[10px] mr-0`} style={{"--bg-colour": colours?.secondary} as React.CSSProperties}></div>
                    </>
                }
            </div>
            <Body screen={state?.currentScreen}/>
            <div className="flex mt-[10px]">
                <div className={`flex ${getDisplayOption(state?.currentScreen, "footer_event_name") ? "" : "hidden"}`}>
                    <div className={classIcons} style={{"--bg-colour": colours?.secondary} as React.CSSProperties}></div>
                    <div className={`${classText} ml-[10px] font-metropolis-black`}>{config?.info.event_name}: <span className='text-colour' style={{"--text-colour": colours?.highlight} as React.CSSProperties}>{config?.info.tagline}</span></div>
                </div>
                <div className="ml-auto mr-0 w-[400px] h-[60px] bg-black/75">
                    <img className="-translate-y-[84px]"src={"/logo-long.png"}/>
                </div>
                <div className={`${classIcons} ml-[10px] mr-0`} style={{"--bg-colour": colours?.secondary} as React.CSSProperties}></div>        
            </div>
        </div>
    )
    
}

function Body({screen}: {screen: string}) {
    const configBreak = useConfig().break;

    const bodyDivRef = useRef<HTMLDivElement>(null);

    const [prev, setPrev] = useState("");
    const [out, setOut] = useState(false);

    const getRemarks = (key: string) => {
        return (
            !configBreak?.remarks[getType(key)] ? "" : 
            <div className="absolute font-metropolis text-3xl text-white text-right right-3 bottom-2">
                <TextFormatter text={configBreak?.remarks[getType(key)]}/>           
            </div>
        )
    }

    useLayoutEffect(() => {
        setOut(true);

        const timeout = setTimeout(() => {
            setOut(false);
            const anotherTimeout = setTimeout(() => {setPrev(screen)}, 1000)
            return () => clearTimeout(anotherTimeout)
        }, 500);

        return () => clearTimeout(timeout);
    }, [screen])

    const classBodyMask = "absolute inset-0 flex justify-center items-center"
    return (
        <div ref={bodyDivRef} className="relative mt-[10px] mx-[110px] h-[850px] bg-black/75 flex justify-center items-center overflow-hidden">
            <div className={`${classBodyMask} ${out ? 'mask-static' : 'transition-wipe mask-up'}`}>
                <BreakScreenBody screen={prev} />
                {getRemarks(prev)}
            </div>
            <div className={`${classBodyMask} ${out ? 'mask-down' : 'transition-wipe mask-static'}`}>
                <BreakScreenBody screen={screen} />
                {getRemarks(screen)}
            </div>
        </div>
    )
}

function Title({screenData}: {screenData: any}) {
    const [prev, setPrev] = useState<any>({title: "‎", subtitle: ""});
    const [next, setNext] = useState<any>({title: "‎", subtitle: ""});
    const [out, setOut] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!wrapperRef.current || !nextRef.current || !screenData?.title) return;

        const apply = () => {
            if (!wrapperRef.current || !measureRef.current) return;

            // Measure widths
            const textWidth = measureRef.current.offsetWidth || 0;
            const styles = getComputedStyle(wrapperRef.current);
            const paddingLeft = parseFloat(styles.paddingLeft);
            const paddingRight = parseFloat(styles.paddingRight);

            const targetWidth = textWidth + paddingLeft + paddingRight + 1;
            const currWidth = wrapperRef.current?.offsetWidth || 0;

            if (!wrapperRef.current.style.width) wrapperRef.current.style.width = `${currWidth}px`

            // Animation for new text if wider
            if (targetWidth > currWidth) {
                requestAnimationFrame(() => {
                    if (wrapperRef.current) wrapperRef.current.style.width = `${targetWidth}px`
                })
            }
            setNext({ title: screenData.title, subtitle: screenData.subtitle });
            setOut(true);

            // set back
            const timeout = setTimeout(() => {
                setOut(false);

                // if new text shorter than the old text, shrink after the slide and when it's visible
                if (targetWidth <= currWidth) {
                    setTimeout(() => {
                        if (wrapperRef.current) wrapperRef.current.style.width = targetWidth + "px";
                    }, 1000)
                }

                const anotherTimeout = setTimeout(() => {setPrev({title: screenData?.title, subtitle: screenData?.subtitle})}, 1000)
                return () => clearTimeout(anotherTimeout)
            }, 500);

            return () => clearTimeout(timeout);
        }

        if (typeof document !== 'undefined' && 'fonts' in document) {
            Promise.race([
                document.fonts.ready,
                new Promise((resolve) => setTimeout(resolve, 200))
            ]).then(() => {
                apply();
            });
        } else {
            apply();
        }

    }, [screenData?.title, screenData?.subtitle]);

    const classText = ` px-[0.5em] bg-black/75 text-white text-[40px] h-[60px] 
                        ml-[10px] leading-[60px] uppercase overflow-hidden transition-width-fast
                        `
    return (
        <div className={`${classText} font-metropolis-black`} ref={wrapperRef}>
            {/* PREVIOUS */}
            <div className={out ? '' : 'transition-slide-fast slide-up-out'}>
                {prev.title} <span className="font-metropolis">{prev.subtitle}</span>
            </div>
            {/* CURRENT */}
            <div className={out ? 'slide-up-ready' : 'transition-slide-fast slide-up-out' } ref={nextRef}>
                {next.title} <span className="font-metropolis">{next.subtitle}</span>
            </div>
            {/* MEASURE CURRENT TEXT */}
            <div className="absolute opacity-0 pointer-events-none whitespace-nowrap top-0 left-0" ref={measureRef}>
                {screenData?.title} <span className="font-metropolis">{screenData?.subtitle}</span>
            </div>

        </div>
    )
}