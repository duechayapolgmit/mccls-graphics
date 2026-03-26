'use client'
import { useEffect, useRef, useState } from 'react';
import styles from './teams.module.css'
import { getBackground, getIconPath, getMemberStatus, getTeamMembers } from '@/lib/client/teamInfo';
import { getPlayerName, getPlayerProfile } from '@/lib/client/playerInfo';
import html2canvas from 'html2canvas';

export default function Page() {
    const captureRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKey = async (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 's') {
                if (!captureRef.current) return;

                captureRef.current.classList.add(styles.capture);

                await document.fonts.ready;

                await new Promise(r => requestAnimationFrame(r))

                const canvas = await html2canvas(captureRef.current, {
                    scale: 1,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    width: 1920,
                    height: 1080
                });

                captureRef.current.classList.remove(styles.capture);
                
                const link = document.createElement('a');
                link.download = 'teams.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className={styles.main} ref={captureRef}>
            <div className={styles.screen}>
                <div className={styles.left}>
                    <TeamAndMembers option="left" team="RED"/>
                    <TeamAndMembers option="left" team="ORANGE"/>
                    <TeamAndMembers option="left" team="YELLOW"/>
                    <TeamAndMembers option="left" team="LIME"/>
                    <TeamAndMembers option="left" team="GREEN"/>
                    <div className={styles.event_name}>
                        <p>MC Championship: <span className={styles.event_tagline}>Hermit Takeover</span></p>
                    </div>
                </div>
                <div className={styles.right}>
                    <TeamAndMembers option="right" team="CYAN"/>
                    <TeamAndMembers option="right" team="AQUA"/>
                    <TeamAndMembers option="right" team="BLUE"/>
                    <TeamAndMembers option="right" team="PURPLE"/>
                    <TeamAndMembers option="right" team="PINK"/>
                    
                    <div className={styles.remark}>
                        <p><span className={styles.remark_sub}>Lime = Sub-ins</span> | <span className={styles.remark_new}>Yellow = New Player</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TeamAndMembers({option, team}: {option: string, team: string}) {
    const membersDisplay = (team: string) => {
        let members = getTeamMembers(team);
        let memberIcons = members.map( (member: string) => {
            return <Member key={member} team={team} name={member}/>
        })
        return <div className={styles.members}>{memberIcons}</div>
    }

    if (option == "left") {
        return (
            <div className={styles.team}>
                <Team team={team}/>
                <div className={styles.members_left}>
                    {membersDisplay(team)}
                </div>
            </div>
        )
    } else if (option == "right") {
        return (
            <div className={styles.team}>
                <div className={styles.members_right}>
                    {membersDisplay(team)}                 
                </div>
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

function Member({team, name}: {team: string, name: string}) {

    let getName = (name: string) => {
        let displayName = getPlayerName(name);
        if (displayName) {
            switch (getMemberStatus(name)) { // Checks if they are a new player or not, then determine the colour
                case "none":
                    return <div className={styles.nameplate}>{displayName}</div>
                case "newcomer":
                    return <div className={`${styles.nameplate} ${styles.nameplate_new}`}>{displayName}</div>
                case "subsitute":
                    return <div className={`${styles.nameplate} ${styles.nameplate_sub}`}>{displayName}</div>
                default:
                    return <div className={styles.nameplate}>{displayName}</div>
            }
        }
        else return null;
    }

    return (
        <div className={styles.member} style={{"--bg-colour": getBackground(team), "--profile": `url(${getPlayerProfile(name)})`} as React.CSSProperties}>
            {getName(name)}
        </div>
    )
}