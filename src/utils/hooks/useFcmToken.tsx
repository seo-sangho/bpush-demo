'use client';

import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '@/utils/firebase-messaging-sw';

const useFcmToken = () => {
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState('');

  function getAgentSystem() {
    if (!('navigator' in window)) {
      return 'unknown';
    }

    // Use the modern 'web hints' provied by
    // 'userAgentData' if available, else use
    // the deprecated 'platform' as fallback.
    const platform = navigator.userAgent?.toLowerCase();

    if (platform.includes('win')) return 'WINDOWS';
    if (platform.includes('mac')) return 'MACOS';
    if (platform.includes('linux')) return 'LINUX';
    return 'unknown';
  }

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const messaging = getMessaging(firebaseApp);

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          console.log('permission: ', permission);
          if (getAgentSystem() === 'MACOS') {
            setNotificationPermissionStatus(permission);
          }

          // Check if permission is granted before retrieving the token
          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (currentToken) {
              setToken(currentToken);
            } else {
              console.log(
                'No registration token available. Request permission to generate one.',
              );
            }
          } else {
            //
            console.log(`so may be here?? ${permission}`);
          }
        } else {
          console.log('so may be here?');
        }
      } catch (error) {
        console.log('An error occurred while retrieving token:', error);
      }
    };

    retrieveToken();
  }, []);

  return {
    fcmToken: token,
    notificationPermissionStatus,
    setToken,
    setNotificationPermissionStatus,
  };
};

export default useFcmToken;
