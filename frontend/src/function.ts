/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function triggerNotification(
  message: string,
  options?: {
    title?: string;
    icon?: string;
    badge?: string;
    url?: string;
  }
) {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;

    const notificationOptions: NotificationOptions = {
      body: message,
      icon: options?.icon || "/sprite.svg",
      badge: options?.badge || "/sprite.svg",
      data: { url: options?.url || "/" },
    };

    registration.showNotification(
      options?.title || "Notification",
      notificationOptions
    );
  }
}

export const subscribeToPushNotifications = async () => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service Workers not supported");
    return null;
  }

  try {
    // Ensure notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("Notification permission denied");
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BDyZ1XeOJAylJFaGS368s5oWMCjgVtF0PDvdxMrFSbQS_LUa8yL1YnTNlEd0hTYHjEeCMwyppCwOXsgSXpSAt9Y"
      ),
    });

    // Send subscription to your backend
    await fetch("https://notification-pwa-backend.vercel.app/api/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return subscription;
  } catch (error) {
    console.error("Subscription failed:", error);
    return null;
  }
};

// Trigger custom notification
export async function sendPushNotification(
  subscription: any,
  { title, body, icon, badge }: any
) {
  try {
    const response = await fetch(
      "https://notification-pwa-backend.vercel.app/api/send-notification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          title,
          body,
          icon,
          badge,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Notification send failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

// Utility function to convert the VAPID key
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};
