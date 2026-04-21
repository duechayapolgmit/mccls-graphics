import breakInfo from '@/data/break_screens.json'

export const getAvailableKeys = () => Object.keys(breakInfo)

export function getCardGridList(key) {
    let data = breakInfo[key]
    if (!data) return;
    if (data.type != "card_grid") return;

    return data.list;
}