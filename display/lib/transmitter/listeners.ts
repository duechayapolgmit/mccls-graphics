type Listener = (data: any) => void;

const listeners = new Map<String, Set<Listener>>();

// Listeners (route connections) subscribe to the data - unsubscribe if cancel
export function subscribe(listener: Listener, type: string) {
  // add the listener to the set
  let listenerSet = listeners.get(type) || new Set<Listener>();
  listenerSet.add(listener);

  listeners.set(type, listenerSet);

  // delete if called function again
  return () => {
    let listenerSet = listeners.get(type) || new Set<Listener>();
    listenerSet.delete(listener);
    console.log('deadge')
  }
}

// Notify the listeners (routes)
export function notify(data: any, type: string) {
  let listenerSet = listeners.get(type) || new Set<Listener>();  // get the listener on type

  console.log(listenerSet)
  for (const listener of listenerSet) {
    listener(data);
  }
}
