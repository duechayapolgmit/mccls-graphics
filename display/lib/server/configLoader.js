import yaml from 'js-yaml';
import fs from 'fs';

const config = yaml.load(fs.readFileSync("config/general.yaml", "utf8"));

// Getters
export const getRawConfig = () => { return config; }