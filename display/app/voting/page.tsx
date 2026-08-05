import { apiFetch } from '@/lib/utils/utils';

import VotingClient from './_client';

export default async function Page() {
    const res = await apiFetch('games');
    const gameData = await res.json();

    return (
        <VotingClient gameData={gameData} />
    )   
}