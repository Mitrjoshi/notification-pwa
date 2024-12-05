// service-worker.js
self.addEventListener("push", function (event) {
  const data = event.data.json();

  const options = {
    body: data.notification.body,
    icon: data.notification.icon,
    vibrate: data.notification.vibrate,
    data: data.notification.data,
  };

  event.waitUntil(
    self.registration.showNotification(data.notification.title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Optional: Open a specific page when notification is clicked
  event.waitUntil(clients.openWindow("https://yourapp.com"));
});
