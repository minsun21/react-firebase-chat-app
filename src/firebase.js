import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyBWaC2F4tudG18URbLgpmgtXyEDxpp25fs",
    authDomain: "react-firebase-chat-app-8ddf3.firebaseapp.com",
    databaseURL: "https://react-firebase-chat-app-8ddf3.firebaseio.com",
    projectId: "react-firebase-chat-app-8ddf3",
    storageBucket: "react-firebase-chat-app-8ddf3.appspot.com",
    messagingSenderId: "403757607824",
    appId: "1:403757607824:web:e116b04081f2aad5aee115",
    measurementId: "G-D80CPR3869"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();