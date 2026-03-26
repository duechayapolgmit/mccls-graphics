
const URL = 'http://localhost:3000'

// Configurations
export async function getConfig() {
    const res = await fetch(`${URL}/api/config`);
    return res.json();
}