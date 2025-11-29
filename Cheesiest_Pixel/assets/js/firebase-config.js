const cfg = {
    apiKey: "XXX",
    authDomain: "XXX.firebaseapp.com",
    projectId: "XXX",
    storageBucket: "XXX.appspot.com",
    messagingSenderId: "XXX",
    appId: "XXX"
};

firebase.initializeApp(cfg);
const auth = firebase.auth();
const db = firebase.firestore();
