import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

export const registerNotification = () => {
  // TODO: Replace the following with your app's Firebase project configuration
  // See: https://firebase.google.com/docs/web/learn-more#config-object

  const firebaseConfig = {
    apiKey: 'AIzaSyBRA72KWKpuv8829xJ6Ni9zkyQNpBb_7FQ',
    authDomain: 'web-push-dcb51.firebaseapp.com',
    projectId: 'web-push-dcb51',
    storageBucket: 'web-push-dcb51.appspot.com',
    messagingSenderId: '468105964735',
    appId: '1:468105964735:web:62e7bd18f3a603e54aaa0a',
  };

  const vapidKey =
    'BOZ6IIpyE3CxIvwvFVAT4jnaTI3n_s4QO37uI4B8qJOzOTSAz-s6IEb8JDGtV2LpB60OkWB4kEPU1KwRyTJZf8U';

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Cloud Messaging and get a reference to the service
  const messaging = getMessaging(app);

  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.

  getToken(messaging, { vapidKey })
    .then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        fetch('http://localhost:5000/subscribe', {
          method: 'POST',
          body: JSON.stringify({ currentToken }),
          headers: {
            'content-type': 'application/json',
          },
        }).catch(console.error);
      } else {
        // Show permission request UI
        console.log(
          'No registration token available. Request permission to generate one.'
        );
        // ...
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
};
