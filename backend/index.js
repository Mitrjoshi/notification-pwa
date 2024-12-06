const express = require("express");
const webPush = require("web-push");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Configure web-push with VAPID keys
webPush.setVapidDetails(
  "mailto:mitrjoshi26@gmail.com",
  "BDyZ1XeOJAylJFaGS368s5oWMCjgVtF0PDvdxMrFSbQS_LUa8yL1YnTNlEd0hTYHjEeCMwyppCwOXsgSXpSAt9Y",
  "5GEI2I4gGNKRa0GAOp0QpVEc0wadRIpuGjlBO2TzYnk"
);

app.use(cors());
app.use(bodyParser.json());

// Store subscriptions (in a real app, use a database)
const subscriptions = new Set();

// Endpoint for client to subscribe
app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  // Add to our set of subscriptions
  subscriptions.add(JSON.stringify(subscription));

  res.status(201).json({});
  console.log("Subscription added");
});

// Endpoint to send notifications
app.post("/send-notification", (req, res) => {
  const notificationPayload = {
    notification: {
      title: "New Notification",
      body: req.body.message || "You have a new message!",
      icon: "/sprite.svg",
    },
  };

  Promise.all(
    Array.from(subscriptions).map((sub) =>
      webPush.sendNotification(
        JSON.parse(sub),
        JSON.stringify(notificationPayload)
      )
    )
  )
    .then(() =>
      res.status(200).json({ message: "Notification sent successfully." })
    )
    .catch((err) => {
      console.error("Error sending notification", err);
      res.sendStatus(500);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
