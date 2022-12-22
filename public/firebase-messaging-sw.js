console.log('Service worker initialized');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyBRA72KWKpuv8829xJ6Ni9zkyQNpBb_7FQ',
  authDomain: 'web-push-dcb51.firebaseapp.com',
  projectId: 'web-push-dcb51',
  storageBucket: 'web-push-dcb51.appspot.com',
  messagingSenderId: '468105964735',
  appId: '1:468105964735:web:62e7bd18f3a603e54aaa0a',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const initMessaging = firebase.messaging();

initMessaging.onBackgroundMessage(function (payload, e, f) {
  console.log(' Service Worker :Message received in background', payload, e, f);

  checkNotification(payload, {
    notificationType: payload.data.notificationType,
  });
  // showNotification(payload);
});

function checkNotification(payload, notificationFilter) {
  self.registration
    .getNotifications(notificationFilter)
    .then(function (notifications) {
      console.log('notifications', notifications);
      if (notifications && notifications.length > 0) {
        for (var i = 0; i < notifications.length; i++) {
          var existingNotification = notifications[i];
          if (
            existingNotification.data &&
            existingNotification.data.notificationType ==
              payload.data.notificationType
          ) {
            console.log('closing notifiation');
            existingNotification.close();
          }
        }
      }
      return showNotification(payload);
    })
    .catch(function (err) {
      console.error('Unable to retrieve data', err);
      return showNotification(payload);
    });
}

function showNotification(payload) {
  if (
    payload.data &&
    payload.data.title &&
    payload.data.body &&
    payload.data.url
  ) {
    const notificationOptions = {
      body: payload.data.body,

      ...(payload.data.icon && { icon: payload.data.icon }),
      ...(payload.data.image && { image: payload.data.image }),
      data: {
        url: payload.data.url,
        uba_data: payload.data.uba_data,
        notificationType: payload.data.notificationType,
      },
    };
    console.log('showing notification');
    self.registration.showNotification(payload.data.title, notificationOptions);
  }
}

self.addEventListener('message', (payload) => {
  console.log(' Service Worker :Message received in message', payload);
  checkNotification(payload.data, {
    notificationType: payload.data.data.notificationType,
  });
  //  payload && payload.data && showNotification(payload.data);
});

self.addEventListener('install', function (event) {
  console.log(' Service Worker :Service worker install event');
  event.waitUntil(
    // Force the SW to transition from installing -> active state
    self.skipWaiting()
  );
});

self.addEventListener('activate', (event) => {
  console.log(' Service Worker :Service worker activate event');
  event.waitUntil(clients.claim());
});
