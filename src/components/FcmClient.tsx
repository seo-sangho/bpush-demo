'use client';

import { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import useFcmToken from '@/utils/hooks/useFcmToken';
import firebaseApp from '@/utils/firebase-messaging-sw';
import axios from 'axios';

function dispatchToken(fcmToken: string) {
  const url = process.env.NEXT_PUBLIC_BPUSH_API_TOKEN_SAVE ?? '';
  const USER = process.env.NEXT_PUBLIC_BPUSH_USER ?? '';
  const COM_CODE = process.env.NEXT_PUBLIC_BPUSH_COMPANY ?? '';

  // axios test
  if (fcmToken) {
    axios
      .post(url, {
        userId: USER,
        pushToken: fcmToken,
        companyCode: COM_CODE,
        browserType: window.navigator.userAgent.toLowerCase(),
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default function FcmClient() {
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  fcmToken && console.log('FCM token:', fcmToken, notificationPermissionStatus);

  // 서버에 토큰을 저장
  dispatchToken(fcmToken);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground push notification received:', payload);
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  return <div></div>;
}