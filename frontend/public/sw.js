self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "Default Notification",
    body: "You have a new notification",
    icon: "/default-icon.png",
  };

  const options = {
    body: data.body,
    icon: data.icon || "/default-icon.png",
    badge: "/default-badge.png",
    data: data.data || {},
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  // Close the notification
  event.notification.close();

  // Open a specific URL or perform an action
  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});
