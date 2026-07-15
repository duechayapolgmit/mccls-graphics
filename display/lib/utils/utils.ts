const API_URL = "http://localhost:3000/api"

/* SORT ALPHABETICALLY (IGNORE-CASE) */
export const sortNoCase = (array: []) => {
    array.sort((a : string, b : string) => a.localeCompare(b, 'en', {'sensitivity': 'base'}))
    return array;
}

/* CONVERT HEX COLOUR to RGBA - not checking because is it really needed? */
export const hexToRGBA = (hex: string, opacity: number) => {
    let red = parseInt(hex.substring(1, 3), 16)
    let green = parseInt(hex.substring(3, 5), 16)
    let blue = parseInt(hex.substring(5, 7), 16) 

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

/** RESOLVE THE RULES DEFINED FOR SCALING, ETC. */
interface IRule {
    eq?: number;
    max?: number;
    value: string
}

export const resolveRule = (rules: IRule[], n: number) => {
    for (const rule of rules) {
        if (rule.eq !== undefined && rule.eq === n) return rule.value;
        if (rule.max !== undefined && n <= rule.max) return rule.value;
    }
    return n.toString();
}

/** SORT STUFF - PLAYER AND DATA (1 data point only) */
interface IPlayerData {
    player: string;
    data1: number;
}
export const sortPlayerAndData = (data: IPlayerData[], option: string) => {
    if (option == "ascending") data.sort((a, b) => a.data1 - b.data1)
    if (option == "descending") data.sort((a, b) => b.data1 - a.data1)

    return data;
}

/** VALUE FORMATTING - HAVE A TRAILING .0 IF NOT 100 AND DOESN'T HAVE DECIMALS*/
export const formatValue = (val: any) => {
    if (val == 100) return val;
    if (val % 1 == 0) return val + ".0";
    
    return val
}

/* FETCHING DATA */
export async function apiFetch(endpoint: string, params?: URLSearchParams) {
  const url = params ? `${API_URL}/${endpoint}?${params.toString()}` : `${API_URL}/${endpoint}`;
  return fetch(url, {cache:'no-store'})
}