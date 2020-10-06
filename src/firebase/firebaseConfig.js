import firebase from 'firebase/app'
import 'firebase/firestore';
let firebaseDB = firebase.firestore();

// // Disable deprecated features
firebaseDB.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  // timestampsInSnapshots: true
});

firebaseDB.enablePersistence({
  synchronizeTabs: true
});

export const db = firebaseDB;