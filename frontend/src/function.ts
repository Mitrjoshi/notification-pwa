/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    url?: string;
    [key: string]: any;
  };
}

// notificationService.ts
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

export async function subscribeToPushNotifications(
  publicKey: string
): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.error("Push notifications are not supported");
    return null;
  }

  try {
    // Ensure service worker is registered
    const registration = await navigator.serviceWorker.ready;

    // Convert VAPID public key
    const convertedVapidKey = urlBase64ToUint8Array(publicKey);

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    // Send subscription to backend
    await sendSubscriptionToServer(subscription);

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return null;
  }
}

async function sendSubscriptionToServer(subscription: PushSubscription) {
  try {
    const response = await fetch("https://your-backend-url.com/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error("Failed to send subscription to server");
    }
  } catch (error) {
    console.error("Error sending subscription to server:", error);
  }
}

export function triggerLocalNotification(notificationData: NotificationData) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon || "/default-icon.png",
        badge: notificationData.badge || "/default-badge.png",
        data: notificationData.data || {},
      });
    });
  } else {
    // Fallback for browsers without service worker support
    new Notification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || "/default-icon.png",
    });
  }
}

// Utility function to convert VAPID key
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
