let eventSource = null;
let prevState = null;
const ports = new Set();

self.onconnect = (e) => {
  const port = e.ports[0];
  ports.add(port);

  // Send cached state immediately
  if (prevState !== null) port.postMessage(prevState);

  // Only instantiate the SSE stream once across all browser sources
  if (!eventSource) {
    eventSource = new EventSource('/api/subscribe');

    eventSource.onmessage = (event) => {
      prevState = event.data
      // Broadcast incoming SSE data to all sources
      ports.forEach((p) => p.postMessage(event.data));
    };

    eventSource.onerror = (err) => {
      console.error('[SharedWorker] SSE Connection Error:', err);
    };
  }

  // Listen for tab/source closures to clean up sockets
  port.onmessage = (msg) => {
    if (msg.data === 'unload') {
      ports.delete(port);
      // Close the SSE connection if all sources are closed
      if (ports.size === 0 && eventSource) {
        eventSource.close();
        eventSource = null;
        prevState = null;
      }
    }
  };

  port.start();
};