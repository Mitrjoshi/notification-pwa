import React, { useState, useEffect } from "react";
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
  triggerLocalNotification,
} from "./function";

const NotificationButton: React.FC = () => {
  const [notificationData, setNotificationData] = useState({
    title: "",
    body: "",
    icon: "/default-icon.png",
  });

  useEffect(() => {
    // Automatically request permission and subscribe on component mount
    const initializePushNotifications = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        const publicKey = "YOUR_VAPID_PUBLIC_KEY";
        await subscribeToPushNotifications(publicKey);
      }
    };

    initializePushNotifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      alert("Notification permission denied");
      return;
    }

    // Trigger local notification
    triggerLocalNotification({
      title: notificationData.title,
      body: notificationData.body,
      icon: notificationData.icon,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Notification Title"
        value={notificationData.title}
        onChange={(e) =>
          setNotificationData((prev) => ({ ...prev, title: e.target.value }))
        }
        required
      />
      <input
        type="text"
        placeholder="Notification Message"
        value={notificationData.body}
        onChange={(e) =>
          setNotificationData((prev) => ({ ...prev, body: e.target.value }))
        }
        required
      />
      <input
        type="text"
        placeholder="Icon URL (optional)"
        value={notificationData.icon}
        onChange={(e) =>
          setNotificationData((prev) => ({ ...prev, icon: e.target.value }))
        }
      />
      <button type="submit">Send Notification</button>
    </form>
  );
};

export default NotificationButton;
