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

  const detectMobileDevice = (agent) => {
    록;
    const mobileRegex = [
      /Android/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return mobileRegex.some((mobile) => agent.match(mobile));
  };

  // 모바일 경우에 두번 호출되므로 이를 방지하기 위해 모바일이 아닌 경우에만 호출되도
  if (!detectMobileDevice()) {
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
