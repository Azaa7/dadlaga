import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
const apps= getApps();
const serviceAccount = require("path/to/serviceAccountKey.json");
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
});
initializeApp({
    credential: cert({
      projectId: "<PROJECT_ID>",
      clientEmail: "foo@<PROJECT_ID>.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----<KEY>-----END PRIVATE KEY-----\n"
    }),
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
  });