self.addEventListener("push", (event) => {
  // Ensure you can parse the full notification data
  const data = event.data
    ? event.data.json()
    : {
        title: "Default Notification",
        body: "Default message",
        icon: "/icon.png",
      };

  // Ensure all required properties are present
  const options = {
    body: data.body || "No message",
    icon: data.icon || "/default-icon.png",
    // Add more customization options
    badge: data.badge || "/badge.png",
    tag: data.tag || "default-tag",
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", options)
  );
});
