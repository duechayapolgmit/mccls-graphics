import config from '@/config/general.json'

import teamInfo from '@/data/team_info.json';
import membersInfo from '@/data/team_members.json'

export function getTeamName(team) {
    let data = teamInfo[team];

    if (data) return data.name;
    return "";
}

export function getIconPath(team) {
    let data = teamInfo[team];

    if (data) return data.icon
    return null;
}

export function getBackground(team) {
    let data = teamInfo[team]

    if (data) return data.colour;
    return config.colours.secondary;
}

export function getCardBackground(team) {
    let data = teamInfo[team]

    if (data) return data.card;
    return "/team/card/Default.png";
}

export function getTeamMembers(team) {
    let data = membersInfo.teams[team]

    if (data) return data
    return []
}

export function getTeamFromMember(name) {
    let teams = membersInfo.teams;

    for (let teamKey of Object.keys(teams)) { // Search all teams
        let team = teams[teamKey]
        let searchRes = team.find((member) => member == name)
        
        if (searchRes) return teamKey
    }

    return "DEFAULT";
}

export function getMemberStatus(name) {
    let status = "none";

    if (membersInfo.new_players.find((member) => member == name)) status = "newcomer";
    else if (membersInfo.sub_players.find((member) => member == name)) status = "substitute";

    return status;
}