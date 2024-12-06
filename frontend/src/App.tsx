import React, { useState } from "react";
import axios from "axios";

// const BACKEND_URL = "https://notification-pwa-backend.vercel.app";
const BACKEND_URL = "http://localhost:3000";
const PUBLIC_VAPID_KEY =
  "BDyZ1XeOJAylJFaGS368s5oWMCjgVtF0PDvdxMrFSbQS_LUa8yL1YnTNlEd0hTYHjEeCMwyppCwOXsgSXpSAt9Y";

const App: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeUser = async () => {
    try {
      // Request permission
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.error("Permission not granted");
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      // Send subscription to backend
      await axios.post(`${BACKEND_URL}/subscribe`, subscription);

      setIsSubscribed(true);
    } catch (error) {
      console.error("Failed to subscribe", error);
    }
  };

  const sendTestNotification = async () => {
    try {
      await axios.post(`${BACKEND_URL}/send-notification`, {
        message: "Hello from React App!",
      });
    } catch (error) {
      console.error("Failed to send notification", error);
    }
  };

  return (
    <div>
      <button onClick={subscribeUser} disabled={isSubscribed}>
        {isSubscribed ? "Subscribed" : "Subscribe to Notifications"}
      </button>
      <button onClick={sendTestNotification} disabled={!isSubscribed}>
        Send Test Notification
      </button>
    </div>
  );
};

export default App;
