export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted");
    return true;
  } else {
    console.error("Notification permission denied");
    return false;
  }
}

export function triggerNotification(message: string) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      const options: NotificationOptions = {
        body: message,
        icon: "/sprite.svg",
      };

      registration.showNotification("Notification", options);
    });
  }
}

export const subscribeToPushNotifications = async () => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service Workers are not supported in this browser");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const publicKey =
    "BDyZ1XeOJAylJFaGS368s5oWMCjgVtF0PDvdxMrFSbQS_LUa8yL1YnTNlEd0hTYHjEeCMwyppCwOXsgSXpSAt9Y"; // Your VAPID_PUBLIC_KEY

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  console.log("Push Subscription:", subscription);

  // Send subscription to your backend
  await fetch("http://localhost:3000/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
};

// Utility function to convert the VAPID key
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};
