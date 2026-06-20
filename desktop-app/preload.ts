import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('desktopApi', {
  sendTranscript: async (text: string) => {
    await fetch('http://localhost:3000/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  },
});
