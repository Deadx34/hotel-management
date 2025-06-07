🚀 How to Run This Project
This guide explains how to set up and run the application locally.

1. Firebase Setup
Before running the app, you need a backend to connect to.

Navigate to the Firebase Console and create a new project.
In your new project, add a Web App.
Go to the Authentication tab, select "Sign-in method," and enable the Email/Password provider.
Go to the Firestore Database tab, create a new database, and start it in Test Mode.
2. Local Environment Setup
Clone the Repository:
Bash

git clone <your-repository-url>
Navigate into the Frontend Directory:
Bash

cd hotel-reservation-frontend
Install Dependencies:
Bash

npm install
Configure Firebase Credentials:
Inside the src/ directory, create a new file named firebase-config.js.
Copy your unique firebaseConfig object from the Firebase console into this file, exporting auth and db as shown below:
JavaScript

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your config object from Firebase here
const firebaseConfig = {
  apiKey: "AIzaxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:123456abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
3. Start the Application
From inside the hotel-reservation-frontend directory, run the start command:
Bash

npm start
The application will open in your browser, typically at http://localhost:3000.


📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
