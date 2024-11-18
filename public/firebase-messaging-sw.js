importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js',
);

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyB4nqBwQqhCXc-g7Y1DIdbsblVAnAo9yTI',
  projectId: 'webpush-cdd58',
  messagingSenderId: '790619394908',
  appId: '1:790619394908:web:3a5509cb7267bd2735e799',
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(async (payload) => {
  console.log(`onBackgroundMessage: ${JSON.stringify(payload)}`);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
