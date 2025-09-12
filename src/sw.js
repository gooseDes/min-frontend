import { address } from "./wsClient.js";

self.addEventListener("push", (event) => {
  console.log("Push received:", event);
  let data;
  try {
    data = event.data.json();
  } catch {
    console.log(event.data);
    return;
  }

  event.waitUntil(
    self.registration.showNotification(data.chat, {
      body: data.message,
      icon: `${address}/avatars/${data.author}.webp`,
      badge: `${address}/avatars/${data.author}.webp`,
      tag: 'message',
      vibration: [200, 100, 200, 100, 400]
    })
  );
});


self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
