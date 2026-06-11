import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const VAPID_PUBLIC_KEY = 'BGhgDENRZzuh8VA387TYFQVYkkxdS5X_XQPt0nm_-ckFrWUrQPddEwNu6vi6bjCqkhzXkgFW4Qljll3zAG8mCFg';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Only attempt to subscribe if the user is authenticated and the browser supports it
    if (!isAuthenticated || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    const subscribeToPush = async () => {
      try {
        let permission = Notification.permission;
        
        // Ask for permission if not already granted or denied
        if (permission === 'default') {
          // You might want to show a custom UI modal here before asking for the browser permission
          // But for now, we'll request it directly after login
          permission = await Notification.requestPermission();
        }

        if (permission !== 'granted') {
          return; // User denied or dismissed
        }

        // Get the active service worker registration
        const registration = await navigator.serviceWorker.ready;

        // Check if already subscribed
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          // Send existing subscription to backend just to ensure it's saved
          await axiosInstance.post('/api/auth/push-subscribe', {
            subscription: existingSubscription
          });
          return;
        }

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Send subscription to backend
        await axiosInstance.post('/api/auth/push-subscribe', {
          subscription
        });

        toast.success('Push notifications enabled!');
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
      }
    };

    // Give the app a few seconds to load before prompting
    const timer = setTimeout(() => {
      subscribeToPush();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  return null; // This component doesn't render anything
}
