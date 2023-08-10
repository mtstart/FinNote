// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const environment = {
  // firebase: {
  //   apiKey: "AIzaSyD1tz-pRJeRU882FEDdMCKsHT4kRpSzxX4",
  //   authDomain: "finnotedb.firebaseapp.com",
  //   projectId: "finnotedb",
  //   storageBucket: "finnotedb.appspot.com",
  //   messagingSenderId: "581170754601",
  //   appId: "1:581170754601:web:fb581b4bedf0c99b82d838",
  //   measurementId: "G-0QHKF4ZQQW"
  // },
  firebase: {
    projectId: 'finnote2-70a8c',
    appId: '1:811871768518:web:9ab62469434dab2ff32cc7',
    storageBucket: 'finnote2-70a8c.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyCKXh9pjACUKNh4yQtlCj4XKMgKvvC2PqQ',
    authDomain: 'finnote2-70a8c.firebaseapp.com',
    messagingSenderId: '811871768518',
  },
  production: false
};

// // Initialize Firebase
// const app = initializeApp(environment.firebase);
// initializeApp(environment.firebase);
// const storage = getStorage(app, "gs://finnote2-70a8c.appspot.com/");

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
