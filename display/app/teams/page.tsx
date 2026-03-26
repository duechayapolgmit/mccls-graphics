'use client'
import { useEffect, useState } from 'react';
import styles from './teams.module.css'

export default function Page() {

    
    return (
        <div className={styles.main}>
            <div className={styles.screen}>
                <TeamAndMembers option="left"/>
                <TeamAndMembers option="left"/>
                <TeamAndMembers option="left"/>
                <TeamAndMembers option="left"/>
                <TeamAndMembers option="left"/>
                <TeamAndMembers option="right"/>
                <TeamAndMembers option="right"/>
                <TeamAndMembers option="right"/>
                <TeamAndMembers option="right"/>
                <TeamAndMembers option="right"/>
                <div className={styles.event_name}>
                    MC Championship: <span className={styles.event_tagline}>Hermit Takeover</span>
                </div>
                <div className={styles.remark}>
                    <span className={styles.remark_sub}>Lime = Sub-ins</span> | <span className={styles.remark_new}>Yellow = New Player</span>
                </div>
            </div>
        </div>
    )
}

function TeamAndMembers({option}: {option: string}) {

    if (option == "left") {
        return (
            <div className={styles.team}>
                <div className={styles.team_icon_left}></div>
                <div className={styles.members_left}></div>
            </div>
        )
    } else if (option == "right") {
        return (
            <div className={`${styles.team} ${styles.team_right}`}>
                <div className={styles.members_right}></div>
                <div className={styles.team_icon_right}></div>
            </div>
        )
    }    
}
