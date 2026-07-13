import fs from 'fs';
import path from "path";

// Get the files in a folder and then load the content to the map
export function loadFolder(folder) {
    const ret = {}

    const fileNames = fs.readdirSync(folder, {withFileTypes: true})
        .filter(entry => entry.isFile())
        .map(entry => entry.name);

    const fileNameMap = {};
    fileNames.forEach(ele => {
        const name = path.parse(ele).name;
        fileNameMap[name] = ele;
    })

    for (const key in fileNameMap) {
        ret[key] = load(folder + "/" + fileNameMap[key])
    }

    return ret
}

// Load data from local file
export function load(file) {
    try {
        const raw = fs.readFileSync(file, "utf8");
        let obj = JSON.parse(raw);

        return obj
    } catch (err) {
        console.error("Can't load a file: "+file);
        return {}
    }
}

// Save data from local file
export function save(path, data) {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
        console.error("Can't save a file: "+path, err);
    }
}
