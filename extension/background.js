// AfterThought Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log('AfterThought Recorder Extension installed.');
});

// Listener for any background tasks (future expansion)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message in background:', message);
  sendResponse({ ok: true, source: 'background' });
  return true;
});
