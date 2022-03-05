// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app";

export const environment = {
  firebase: {
    apiKey: "AIzaSyD1tz-pRJeRU882FEDdMCKsHT4kRpSzxX4",
    authDomain: "finnotedb.firebaseapp.com",
    projectId: "finnotedb",
    storageBucket: "finnotedb.appspot.com",
    messagingSenderId: "581170754601",
    appId: "1:581170754601:web:fb581b4bedf0c99b82d838",
    measurementId: "G-0QHKF4ZQQW"
  },
  production: false,
  passwordHash: "be178c0543eb17f5f3043021c9e5fcf30285e557a4fc309cce97ff9ca6182912"
};

// Initialize Firebase
const app = initializeApp(environment.firebase);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
