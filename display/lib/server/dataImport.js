import fs from 'fs';
import path from "path";

const DATA_FOLDER = 'data';

// Get the files in the data folder and then load the content to the map
const dataContentMap = loadData(DATA_FOLDER)
function loadData(folder) {
    const ret = {}

    const dataFileNames = fs.readdirSync(folder, {withFileTypes: true})
        .filter(entry => entry.isFile())
        .map(entry => entry.name);

    const dataFileNameMap = {};
    dataFileNames.forEach(ele => {
        const name = path.parse(ele).name;
        dataFileNameMap[name] = ele;
    })

    // Load data from files
    function load(file) {
        try {
            const raw = fs.readFileSync(file, "utf8");
            let obj = JSON.parse(raw);

            return obj
        } catch (err) {
            console.error("Can't load a data file: "+file);
            return {}
        }
    }


    for (const key in dataFileNameMap) {
        ret[key] = load(DATA_FOLDER + "/" + dataFileNameMap[key])
    }

    return ret
}

// Get the content based on the file name with no extensions
export const getData = (file) => dataContentMap[file] || {};
