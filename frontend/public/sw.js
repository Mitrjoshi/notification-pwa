self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  // Parse the payload if it exists
  const data = event.data?.json() || {
    title: "Default Title",
    body: "Default message body",
  };

  const { title, body } = data;

  const options = {
    body: body || "No content available.",
    icon: "/sprite.svg", // Update with your icon path
    badge: "/sprite.svg", // Optional badge icon
  };

  // Show the notification
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the notification

  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});
