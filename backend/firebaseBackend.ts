import * as fs from 'fs'

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import admin from 'firebase-admin'

const serviceAccount = JSON.parse(fs.readFileSync('./fb-adminsdk.json', 'utf8'))

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://ordering-meal-app.firebaseio.com'
})

const firebaseApp = initializeApp({
	apiKey: 'AIzaSyCW02MkjREQyIcH6AmtprkaYtkucw_vP3k',
	authDomain: 'ordering-meal-app.firebaseapp.com',
	projectId: 'ordering-meal-app',
	storageBucket: 'ordering-meal-app.appspot.com',
	messagingSenderId: '380131197215',
	appId: '1:380131197215:web:df9cdd15d2e628050df02a'
})

const AdminDB = admin.firestore()
const db = getFirestore(firebaseApp)

export { AdminDB, db }
