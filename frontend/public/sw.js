self.addEventListener("push", (event) => {
  const { message: n, body: t, icon: e } = JSON.parse(event.data.text());

  event.waitUntil(
    self.registration.showNotification(n, {
      body: t,
      icon: e,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});
