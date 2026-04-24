/** GET NUMBER OF COLUMNS BASED ON Map<number, string[]> */
export const getGridColumnAmountFromMap = (data: Map<number, string[]>, rows: number) => getColumns(data, rows).length

export const getGridColumnFormatFromMap = (data: Map<number, string[]>, rows: number) => {
    let columns = getColumns(data, rows);
    let res = [];
    for (let column of columns) {
        res.push(`${column}fr`)
    }

    return columns.join(" ")
}

const getColumns = (data: Map<number, string[]>, rows: number) => {
    // sort the keys in decreasing order first
    let keys = data.keys().toArray();
    keys.sort((a, b) => b - a);

    // for each key, get the number of players in each array
    let playerAmount = [];
    for (let key of keys) {
        playerAmount.push(data.get(key)?.length || 0)
    }

    // determine columns needed by divide them by 3 (CONCRETE) then ceiling them
    let columns = [];
    for (let amount of playerAmount) {
        columns.push(`${Math.ceil(amount / rows)}fr`)
    }

    return columns
}