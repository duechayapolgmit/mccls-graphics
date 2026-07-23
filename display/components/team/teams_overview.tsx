'use client'
import styles from './teams.module.css'

import { getBackground, getIconPath, getMemberStatus, getTeamMembers } from '@/lib/client/teamInfo';
import { getPlayerName, getPlayerProfile } from '@/lib/client/playerInfo';
import { getConfig, getConfigColours } from '@/lib/client/config';

const config = await getConfig();
const colours = await getConfigColours();

export default function TeamsOverview() {
    if (!config) return null;

    return (
        <div className={styles.main}>
            <div className="flex">
                <div className="w-236.25">
                    <TeamAndMembers option="left" team="RED"/>
                    <TeamAndMembers option="left" team="ORANGE"/>
                    <TeamAndMembers option="left" team="YELLOW"/>
                    <TeamAndMembers option="left" team="LIME"/>
                    <TeamAndMembers option="left" team="GREEN"/>
                </div>
                <div className={styles.right}>
                    <TeamAndMembers option="right" team="CYAN"/>
                    <TeamAndMembers option="right" team="AQUA"/>
                    <TeamAndMembers option="right" team="BLUE"/>
                    <TeamAndMembers option="right" team="PURPLE"/>
                    <TeamAndMembers option="right" team="PINK"/>
                    
                    <div className="teams-overview-remark absolute bg-black/75 left-100 w-137.5 h-8
                                    font-metropolis-black text-white uppercase text-center text-[22px]">
                        <p>
                            <span style={{color: colours.substitute}}>Lime = Sub-ins</span>
                            &nbsp;|&nbsp;
                            <span style={{color: colours.newcomer}}>Yellow = New Player</span>
                        </p>
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

    const getBG = (name: string) => {
        let imagePath = getPlayerProfile(name);

        // If name is hannahxxrose or blank
        if (name == "hannahxxrose" || name == "") {
            return {"--bg-colour": getBackground(team), "--profile": `url(${imagePath})`} as React.CSSProperties
        }
        
        return {"--profile": `url(${imagePath})`} as React.CSSProperties
    };

    const getNameplateStyle = (status: string) => {
        let ret = { 
            "--bg-colour": "black",  
            "--text-colour": "white"
        }

        switch (status) {
            case "substitute":
                ret['--bg-colour'] = colours.substitute;
                ret['--text-colour'] = "white";
                break;
            case "newcomer":
                ret['--bg-colour'] = colours.newcomer;
                ret['--text-colour'] = "black";
                break;
        }

        return ret as React.CSSProperties;
    }

    let getName = (name: string) => {
        let displayName = getPlayerName(name);
        if (displayName) return (
            <div className="teams-overview-nameplate absolute bottom-0 w-37.5 h-5 pt-px flex items-center justify-center 
                            font-metropolis-black uppercase text-center text-[16px] overflow-hidden
                            bg-(--bg-colour)/75 text-(--text-colour)"
                 style={getNameplateStyle(getMemberStatus(name))}>
                {displayName}
            </div>
        )
            
        else return null;
    }

    return (
        <div className={styles.member} style={getBG(name)}>
            {getName(name)}
        </div>
    )
}