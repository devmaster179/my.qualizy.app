import firebase from 'firebase/app'
import "@firebase/messaging"

const messaging = firebase.messaging();
messaging.usePublicVapidKey('BNEo8QHNl70VKJPUIlkzwxE-vvqQ_YIU7KjATX9zAA1OKOuqRrbn04ZYMPgSx0oX4UWg9RTxkau89ZA0dIKG4OI');
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  } else {
    console.log('Unable to get permission to notify.');
  }
});

export const fcm = messaging