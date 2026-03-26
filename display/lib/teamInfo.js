import teamInfo from '@/data/team_info.json';

export function getTeamName(team) {
    let data = teamInfo[team];

    if (data) return teamInfo[team].name;
    return "";
}

export function getIconPath(team) {
    let data = teamInfo[team];

    if (data) return teamInfo[team].icon
    return null;
}