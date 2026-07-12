import config from '@/config/general.json'
import { getData } from '../utils/dataHelper';

const teamInfo = await getData('/api/teams/info')
const teamData = await getData('/api/teams/data')

export function checkTeam(team) {
    if (teamInfo?.[team]) return true;
    return false;
}

export function getTeamName(team) {
    let data = teamInfo?.[team];

    if (data) return data.name;
    return "";
}

export function getIconPath(team) {
    let data = teamInfo?.[team];

    if (data) return data.icon
    return null;
}

export function getBackground(team) {
    let data = teamInfo?.[team]

    if (data) return data.colour;
    return config.colours.secondary;
}

export function getCardBackground(team) {
    let data = teamInfo?.[team]

    if (data) return data.card;
    return "/team/card/Default.png";
}

export function getRoster() {
    let teams = teamData.teams;
    let roster = [];

    for (let teamKey of Object.keys(teams)) { // For all teams
        let team = teams[teamKey];
        team.forEach(element => {
            if (element !== "") roster.push(element);
        });
    }

    return roster;
}

export function getTeamMembers(team) {
    let data = teamData?.teams?.[team]

    if (data) return data
    return []
}

export function getTeamFromMember(name) {
    let teams = teamData.teams;

    for (let teamKey of Object.keys(teams)) { // Search all teams
        let team = teams[teamKey]
        let searchRes = team.find((member) => member == name)

        if (searchRes) return teamKey
    }

    return "DEFAULT";
}

export function getMemberStatus(name) {
    let status = "none";

    if (teamData?.new_players.find((member) => member == name)) status = "newcomer";
    else if (teamData?.sub_players.find((member) => member == name)) status = "substitute";

    return status;
}