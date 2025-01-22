import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '~/config/firebase'

export default defineNuxtPlugin((nuxtApp) => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const firestore = getFirestore(app)

  console.log('Firebase initialized')

  return {
    provide: {
      firebase: app,
      auth,
      firestore
    }
  }
}) 