import { loadFolder } from "../utils/localDataManager";

/* --------------
    DATA FOLDER
----------------- */ 
const DATA_FOLDER = 'data';
const dataContentMap = await loadFolder(DATA_FOLDER)

// Get the content based on the file name with no extensions
export const getData = (file) => dataContentMap[file] || {};
