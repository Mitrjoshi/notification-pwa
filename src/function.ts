export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted");
  } else {
    console.error("Notification permission denied");
  }
}

export function triggerNotification(message: string) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("Notification", {
        body: message,
        icon: "/sprite.svg",
      });
    });
  }
}
