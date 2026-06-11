const webpush = require('web-push');

// Set up web-push with VAPID keys from environment variables
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.CONTACT_EMAIL || 'admin@thaaragainaturals.com'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

/**
 * Send a push notification to a specific user
 * @param {Object} user - The mongoose user document
 * @param {Object} payload - The notification payload { title, body, url }
 */
const sendNotificationToUser = async (user, payload) => {
  if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) return;

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || '/',
    icon: '/192x192.png'
  });

  const validSubscriptions = [];
  
  for (const sub of user.pushSubscriptions) {
    try {
      await webpush.sendNotification(sub, notificationPayload);
      validSubscriptions.push(sub);
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        // Subscription has expired or is no longer valid
        console.log('Subscription has expired or is no longer valid: ', error);
      } else {
        console.error('Error sending push notification: ', error);
        // keep it, maybe it's a temporary error
        validSubscriptions.push(sub);
      }
    }
  }

  // Remove invalid subscriptions
  if (validSubscriptions.length !== user.pushSubscriptions.length) {
    user.pushSubscriptions = validSubscriptions;
    await user.save();
  }
};

/**
 * Send a push notification to all admin users
 */
const sendNotificationToAdmins = async (payload) => {
  const User = require('../models/User');
  const admins = await User.find({ role: 'admin' });
  
  const promises = admins.map(admin => sendNotificationToUser(admin, payload));
  await Promise.allSettled(promises);
};

module.exports = {
  sendNotificationToUser,
  sendNotificationToAdmins
};
