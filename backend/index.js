const express = require("express");
const bodyParser = require("body-parser");
const webPush = require("web-push");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// VAPID keys generated using web-push
webPush.setVapidDetails(
  "mailto:mitrjoshi26@gmail.com",
  "BDyZ1XeOJAylJFaGS368s5oWMCjgVtF0PDvdxMrFSbQS_LUa8yL1YnTNlEd0hTYHjEeCMwyppCwOXsgSXpSAt9Y",
  "5GEI2I4gGNKRa0GAOp0QpVEc0wadRIpuGjlBO2TzYnk"
);

// Route to save the subscription
app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  console.log("Received subscription:", subscription);
  // Save subscription to your database
  res.status(201).json({});
});

// Route to send notifications
app.post("/api/send-notification", async (req, res) => {
  const { subscription, message } = req.body;

  const payload = JSON.stringify({
    title: "Sprite",
    body: message || "This is a default message",
  });

  try {
    await webPush.sendNotification(subscription, payload);
    res.status(200).send("Notification sent");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Failed to send notification");
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
