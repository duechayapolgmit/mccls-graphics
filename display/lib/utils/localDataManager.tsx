import { promises as fs } from 'fs';
import path from 'path';

export async function loadFolder(folder: string) {
    const ret: any = {}

    const fileNames = (await fs.readdir(folder, {withFileTypes: true}))
        .filter(entry => entry.isFile())
        .map(entry => entry.name);

    const fileNameMap: any = {};
    fileNames.forEach(ele => {
        const name = path.parse(ele).name;
        fileNameMap[name] = ele;
    })

    for (const key in fileNameMap) {
        ret[key] = load(folder + "/" + fileNameMap[key])
    }

    return ret
}

export async function load(fileName: string) {
    try {
        const filePath = path.resolve(process.cwd(), fileName);
        if (!filePath.startsWith(process.cwd())) throw new Error("[IO] Can't read files outside working directory.")

        const file = await fs.readFile(filePath, 'utf8');
        return JSON.parse(file);
    } catch (error) {
        console.error("[IO] Can't load a file: "+fileName, error);
    }
}

export async function save(fileName: string, data: any) {
    try {
        const filePath = path.resolve(process.cwd(), fileName)
        if (!filePath.startsWith(process.cwd())) throw new Error("[IO] Can't wrtie files outside working directory.")

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
        console.error("[IO] Can't save a file: "+path, err);
    }
}