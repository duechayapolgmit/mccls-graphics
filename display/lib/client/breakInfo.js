import breakInfo from '@/data/break_screens.json'
import { getNoWins } from '../server/wins';

export const getAvailableKeys = () => Object.keys(breakInfo)

export function getTitle(key) {
    let data = breakInfo[key]
    if (!data) return;

    return data.title || "";
}

export function getSubtitle(key) {
    let data = breakInfo[key]
    if (!data) return;

    return data.subtitle || "";
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
