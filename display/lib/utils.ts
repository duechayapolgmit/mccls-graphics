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