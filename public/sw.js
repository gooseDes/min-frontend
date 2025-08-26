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
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/icon512.png",
    })
  );
});
