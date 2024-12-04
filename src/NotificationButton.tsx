import { requestNotificationPermission, triggerNotification } from "./function";

const NotificationButton = () => {
  const handleRequestPermission = async () => {
    await requestNotificationPermission();
  };

  const handleTriggerNotification = () => {
    triggerNotification();
  };

  return (
    <div>
      <button onClick={handleRequestPermission}>
        Request Notification Permission
      </button>
      <button onClick={handleTriggerNotification}>Show Notification</button>
    </div>
  );
};

export default NotificationButton;
