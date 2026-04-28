'use client'
import { useLayoutEffect, useState } from "react"

import config from '@/config/general.json'
import styles from './countdown.module.css'

export default function Page(){
    const [cdTime, setCdTime] = useState({
        days: 0, hours: 0, mins: 0, secs: 0
    })
    const [finish, setFinish] = useState(false);

    useLayoutEffect(() => countdown());

    const countdown = () => {
        const interval = setInterval(() => {
            const targetTime = new Date(config.info.date_time).getTime();
            const currentTime = new Date().getTime();
            const remaining = targetTime - currentTime;

            const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((remaining % (1000 * 60)) / 1000)

            const running = {days: days, hours: hours, mins: mins, secs: secs};
            setCdTime(running)

            if (remaining < 0) {
                clearInterval(interval);
                setFinish(true);
            }
        }, 1000);
    }

    const leadingZero = (time: number) => (time > 9) ? time : `0${time}`

    const getTime = () => {
        return (
            <span>
                {cdTime.days > 0 ? `${cdTime.days}:` : ""}
                {cdTime.hours > 0 ? `${leadingZero(cdTime.hours)}:` : (cdTime.days > 0 ? "00:" : "")}
                {cdTime.mins > 0 ? `${leadingZero(cdTime.mins)}:` : (cdTime.hours > 0 ? "00:" : "")}
                {cdTime.secs > 0 ? `${leadingZero(cdTime.secs)}` : (cdTime.mins > 0 ? "00" : "00")}
            </span>
        )
    }

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.header_logo} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                <div className={styles.header_text}>NEXT MCC</div>
            </div>
            <div className={styles.countdown}>{finish ? 'Soon' : getTime()}</div>
        </div>
    )
}