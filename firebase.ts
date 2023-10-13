import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseApp = initializeApp({
	apiKey: process.env.NEXT_PUBLIC_FB_APP_KEY,
	authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FB_APP_ID
})

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

onAuthStateChanged(auth, (user) => {
	if (user !== null) console.log('logged in')
	else console.log('No user from firebase.ts')
})

export { auth, db, storage }
