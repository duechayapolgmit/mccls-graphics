const BASE_URL = "http://localhost:3000"

export async function getData(path) {
    const res = await fetch(BASE_URL+path);
    return res.json();
}