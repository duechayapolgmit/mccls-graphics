'use client';
import { createContext, useContext, useEffect, useState } from 'react';

interface SSEContextType {
    breakData: any;
    overlayData: any;
    statusData: any;
    placementsData: any;
    gameHistoryData: any;
    votingData: any;
}

const StateContext = createContext<SSEContextType>({
    breakData: null,
    overlayData: null,
    statusData: null,
    placementsData: null,
    gameHistoryData: null,
    votingData: null
});

export function StateProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<SSEContextType>({
        breakData: null,
        overlayData: null,
        statusData: null,
        placementsData: null,
        gameHistoryData: null,
        votingData: null
    });

    useEffect(() => {
        const updateState = (e: string) => {
            const jsonData = JSON.parse(e);
            setData({
                breakData: jsonData.break ?? null,
                overlayData: jsonData.overlay ?? null,
                statusData: jsonData.status ?? null,
                placementsData: jsonData.placements ?? null,
                gameHistoryData: jsonData.game_history ?? null,
                votingData: jsonData.voting ?? null
            })
        }

        // SharedWorker support required
        if (typeof window !== 'undefined' && 'SharedWorker' in window) {
            const worker = new SharedWorker("/sse-worker.js");
            worker.port.onmessage = (e: MessageEvent) => {
                updateState(e.data);
            };
            worker.port.start();

            const handleUnload = () => {
                worker.port.postMessage('unload');
            };
            window.addEventListener('beforeunload', handleUnload);
            

            return () => {
                window.removeEventListener('beforeunload', handleUnload);
                worker.port.postMessage('unload');
            };
        } else {
            // Fallback
            const evtSrc = new EventSource('/api/subscribe');
            evtSrc.onmessage = (e) => updateState(e.data);
            return () => evtSrc.close();
        }

    }, []);

  return <StateContext.Provider value={data}>{children}</StateContext.Provider>;
}

export const useStateBreak = () => useContext(StateContext).breakData;
export const useStateOverlay = () => useContext(StateContext).overlayData;
export const useStateStatus = () => useContext(StateContext).statusData;
export const useStatePlacements = () => useContext(StateContext).placementsData;
export const useStateGameHistory = () => useContext(StateContext).gameHistoryData;
export const useStateVoting = () => useContext(StateContext).votingData;