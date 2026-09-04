/** GET NUMBER OF COLUMNS BASED ON Map<number, string[]> */
export const getGridColumnAmountFromMap = (data: Map<number, string[]>, rows: number) => {
    const cols = getColumns(data, rows)

    return cols.reduce((sum, count) => sum + count, 0);
}

export const getGridColumnFormatFromMap = (data: Map<number, string[]>, rows: number) => {
    let columns = getColumns(data, rows);

    return columns.map(count => `${count}fr`).join(" ")
}

const getColumns = (data: Map<number, string[]>, rows: number) => {
    // sort the keys in decreasing order first
    let keys = data.keys().toArray();
    keys.sort((a, b) => b - a);

    return keys.map(key => {
        const amount = data.get(key)?.length || 0;
        return Math.ceil(amount / rows);
    });
}