import { subscribe } from "./listeners";

export function newStream(data: any, type: string){
    let unsubscribe: (() => void) | null = null;

    return new Response(
        new ReadableStream({
          start(controller) {
            const send = makeSender(controller);
    
            send(data); // Send data first
            unsubscribe = subscribe(send, type); // Subscribe based on type
          },
          cancel() {
            unsubscribe?.();
          }
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
          }
        }
      );
}



export function makeSender(controller: ReadableStreamDefaultController) {
    const encoder = new TextEncoder();

    return (data: any) => { controller.enqueue( encoder.encode(`data: ${JSON.stringify(data)}\n\n`) ); };
}