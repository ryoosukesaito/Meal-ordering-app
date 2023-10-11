import admin from 'firebase-admin'

import * as serviceAccount from './fb-adminsdk.cjs'
// const serviceAccount = JSON.parse(fs.readFileSync('./fb-adminsdk.json', 'utf8'))

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://ordering-meal-app.firebaseio.com'
})

const AdminDB = admin.firestore()

export { AdminDB }
