import { generateMalformedEvent, generateRandomEvent } from '@/lib/mock-events';
import { WebSocketServer } from 'ws';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 Server started on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log("✅ Client connected");

  const interval = setInterval(() => {
    const shouldSendError = Math.random() < 0.1; 
    let payload;
    if (shouldSendError) {
      console.log("⚠️ Sending MALFORMED event");
      payload = generateMalformedEvent();
      
      if (typeof payload === 'string') {
        ws.send(payload); 
        return;
      }
    } else {
      payload = generateRandomEvent();
    }

    ws.send(JSON.stringify(payload));

  }, 1500);

  ws.on('close', () => clearInterval(interval));
});