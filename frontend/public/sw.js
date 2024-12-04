self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  const data = event.data?.json() || {
    title: "Default Title",
    body: "Default Body",
  };
  const { title, body } = data;

  const options = {
    body: body || "Default notification body",
    icon: "/sprite.svg", // Path to your app's icon
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
