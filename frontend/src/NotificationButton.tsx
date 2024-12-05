/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  requestNotificationPermission,
  sendPushNotification,
  subscribeToPushNotifications,
} from "./function";

const NotificationButton = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [subscriptionData, setSubscriptionData] = useState<any>("");

  const handleRequestPermission = async () => {
    await requestNotificationPermission();
  };

  const handleTriggerNotification = async () => {
    const permissionGranted = await requestNotificationPermission();

    if (!permissionGranted) {
      alert("Notification permission denied");
      return;
    }

    if (!inputMessage) return;

    if (subscriptionData) {
      sendPushNotification(subscriptionData, {
        title: "Notification",
        body: inputMessage,
      });
    }
  };

  const handleEnableNotifications = async () => {
    const permissionGranted = await requestNotificationPermission();
    if (permissionGranted) {
      const subscriptionData = await subscribeToPushNotifications();
      setSubscriptionData(subscriptionData);
    }
  };

  useEffect(() => {
    handleEnableNotifications();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setInputMessage("");
        }}
      >
        <input
          placeholder="Notification message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          type="text"
          required
        />
        <button onClick={handleTriggerNotification}>
          Send Notification via Backend
        </button>
      </form>

      <button onClick={handleRequestPermission}>
        Request Notification Permission
      </button>
    </div>
  );
};

export default NotificationButton;
