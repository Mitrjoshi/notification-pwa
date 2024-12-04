self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const { title, body } = data;

  const options = {
    body: body || "Default notification body",
    icon: "/vite.svg",
  };

  event.waitUntil(
    self.registration.showNotification(title || "Notification", options)
  );
});
