'use client'
import { useLayoutEffect, useState } from "react"

import styles from './countdown.module.css'
import { getConfig, getConfigColours } from "@/lib/client/config"
import { Countdown } from "@/components/countdown";

const config = await getConfig();
const colours = await getConfigColours();

export default function Page(){
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.header_logo} style={{"--bg-colour": colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                <div className={styles.header_text}>NEXT MCC</div>
            </div>
            <div className={styles.countdown}>
                <Countdown time={config.info.date_time}/>
            </div>
        </div>
    )
}