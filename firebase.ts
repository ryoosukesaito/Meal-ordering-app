import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseApp = initializeApp({
	apiKey: 'AIzaSyCW02MkjREQyIcH6AmtprkaYtkucw_vP3k',
	authDomain: 'ordering-meal-app.firebaseapp.com',
	projectId: 'ordering-meal-app',
	storageBucket: 'ordering-meal-app.appspot.com',
	messagingSenderId: '380131197215',
	appId: '1:380131197215:web:df9cdd15d2e628050df02a'
})

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

// onAuthStateChanged(auth, (user) => {
//   if (user !== null) console.log("logged in");
//   else console.log("No user");
// });

export { auth, db, storage }
