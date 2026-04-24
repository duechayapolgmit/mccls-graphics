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
