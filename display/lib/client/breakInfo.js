import { getNoWins } from '../server/wins';
import { getData } from '../utils/dataHelper';

const breakInfo = await getData('/api/break_data/screens')
const gameInfo = await getData('/api/games')

export const getAvailableKeys = () => Object.keys(breakInfo)

export function getBreakScreenDetails(key) {
    let data = breakInfo[key]
    if (data) return data || "";
}

export function getType(key) {
    let data = breakInfo[key]
    if (!data) return;

    return data.type || "";
}

export function getDisplayOption(key, option) {
    let data = breakInfo[key]
    if (!data) return true;
    if (!data.display) return true;

    return data.display[option];
}

export function getCardGridList(key) {
    let data = breakInfo[key]
    // Checks if it exists and it's a card_grid
    if (!data) return;
    if (data.type != "card_grid") return;

    // If there's an established list, return it;
    if (data.list) return data.list;

    // Switch case based on pre-established lists
    switch(key) {
        case 'no_wins':
            return getNoWins();
        default:
            return [];
    }
}

export function getGamesFeatured(key) {
    let data = breakInfo[key]
    if (!data) return [];
    if (data.type != "games_overview") return [];

    return data.games || [];
}

export function getGamesOverviewHeader(key) {
    let data = breakInfo[key]
    if (!data) return "";
    if (data.type != "games_overview") return "";

    return data.header_text || "";
}

export function getTeamFromTeamAnalysis(key) {
    let data = breakInfo[key]
    if (!data) return "DEFAULT";
    if (data.type != "team_analysis") return "DEFAULT";

    return data.team || "DEFAULT";    
}