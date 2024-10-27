const { initializeApp } = require('firebase/app');
const { 
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, 
    query, where, orderBy, serverTimestamp, getDoc 
} = require('firebase/firestore');


const { getStorage, ref, getDownloadURL } = require('firebase/storage');

const firebaseConfig = { 
    apiKey: "AIzaSyAoucY_Rj9vGYJMrUgXNS6QYL8qsOtLYxQ",
    authDomain: "stitches-luna.firebaseapp.com",
    projectId: "stitches-luna",
    storageBucket: "stitches-luna.appspot.com",
    messagingSenderId: "40407631807",
    appId: "1:40407631807:web:1ad8bf91d0b56ac6dc430a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);

module.exports = {
    db,
    storage
};
