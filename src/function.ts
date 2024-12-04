export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted");
  } else {
    console.error("Notification permission denied");
  }
}

export function triggerNotification() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("Notification", {
        body: "This is a notification triggered from a button!",
        icon: "/vite.svg",
      });
    });
  }
}
