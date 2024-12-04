import { useEffect, useState } from "react";
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
  triggerNotification,
} from "./function";

const NotificationButton = () => {
  const [inputMessage, setInputMessage] = useState("");

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

    triggerNotification(inputMessage);
  };

  const handleEnableNotifications = async () => {
    const permissionGranted = await requestNotificationPermission();
    if (permissionGranted) {
      await subscribeToPushNotifications();
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
        <button onClick={handleTriggerNotification}>Show Notification</button>
      </form>

      <button onClick={handleRequestPermission}>
        Request Notification Permission
      </button>
    </div>
  );
};

export default NotificationButton;
