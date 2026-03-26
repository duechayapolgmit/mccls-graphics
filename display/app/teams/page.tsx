'use client'
import { useEffect, useState } from 'react';
import styles from './teams.module.css'
import { getColours } from '@/lib/client/configInfo';
import { getBackground, getIconPath } from '@/lib/client/teamInfo';

export default function Page() {

    
    return (
        <div className={styles.main}>
            <div className={styles.screen}>
                <div className={styles.left}>
                    <TeamAndMembers option="left" team="RED"/>
                    <TeamAndMembers option="left" team="ORANGE"/>
                    <TeamAndMembers option="left" team="YELLOW"/>
                    <TeamAndMembers option="left" team="LIME"/>
                    <TeamAndMembers option="left" team="GREEN"/>
                    <div className={styles.event_name}>
                        MC Championship: <span className={styles.event_tagline}>Hermit Takeover</span>
                    </div>
                </div>
                <div className={styles.right}>
                    <TeamAndMembers option="right" team="CYAN"/>
                    <TeamAndMembers option="right" team="AQUA"/>
                    <TeamAndMembers option="right" team="BLUE"/>
                    <TeamAndMembers option="right" team="PURPLE"/>
                    <TeamAndMembers option="right" team="PINK"/>
                    
                    <div className={styles.remark}>
                        <span className={styles.remark_sub}>Lime = Sub-ins</span> | <span className={styles.remark_new}>Yellow = New Player</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TeamAndMembers({option, team}: {option: string, team: string}) {
    if (option == "left") {
        return (
            <div className={styles.team}>
                <Team team={team}/>
                <div className={styles.members_left}></div>
            </div>
        )
    } else if (option == "right") {
        return (
            <div className={styles.team}>
                <div className={styles.members_right}></div>
                <div className={styles.team_icon_right}>
                    <Team team={team}/>
                </div>
            </div>
        )
    }    
}

function Team({team}: {team: string}) {
    return (
        <div className={styles.team_icon} style={{"--bg-colour": getBackground(team)} as React.CSSProperties}>
            <img src={getIconPath(team)}/>
        </div>
    )
}