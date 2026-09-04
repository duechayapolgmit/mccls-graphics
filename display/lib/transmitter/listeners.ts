import { getStateData } from "../server/breakHandler";
import { getEventStatus, getGames, getPlacements } from "../server/eventProgressHandler";
import { getOverlayData } from "../server/overlayHandler";
import { getVotingData } from "../server/votingHandler";

type Listener = (data: any) => void;

const globalListeners = (globalThis as any).__sseMap || new Map<string, Set<Listener>>();
(globalThis as any).__sseMap = globalListeners;

// Listeners (route connections) subscribe to the data - unsubscribe if cancel
export function subscribe(listener: Listener, type: string) {
  // add the listener to the set
  let listenerSet = globalListeners.get(type) || new Set<Listener>();
  listenerSet.add(listener);

  globalListeners.set(type, listenerSet);

  // delete if called function again
  return () => {
    let listenerSet = globalListeners.get(type) || new Set<Listener>();
    listenerSet.delete(listener);
  }
}

// Notify the listeners (routes)
export function notify(data: any, type: string) {
  let listenerSet = globalListeners.get(type) || new Set<Listener>();  // get the listener on type
  let activeCount = listenerSet ? listenerSet.size : 0;

  console.log(`[SSE Status] Channel: "${type}" | Open SSE Sockets: ${activeCount}`);

  for (const listener of listenerSet) {
    listener(data);
  }
}


export const notifyState = async () => {
    const fullJson = {
        placements: getPlacements(),
        break: getStateData(),
        overlay: getOverlayData(),
        status: getEventStatus(),
        game_history: getGames(),
        voting: await getVotingData()
    };
    
    notify(fullJson, "general");
}