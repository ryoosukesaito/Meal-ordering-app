import fs from 'fs'
import path from 'path'

import admin from 'firebase-admin'

//set try and catch since using readFileSync
try {
  const serviceAccount = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../fb-adminsdk.json'), 'utf8')
  )
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ordering-meal-app.firebaseio.com'
  })
} catch (error) {
  console.error('something went wrong in firebaseBackend', error)
}

const AdminDB = admin.firestore()
export { AdminDB }
