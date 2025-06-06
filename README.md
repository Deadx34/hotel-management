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




📊 AI in Hospitality: Market Research Infographic SPA
This repository contains a fully responsive, single-page application (SPA) that presents a deep research report on the AI in the Hospitality Industry. The project transforms complex market data—including growth forecasts, segmentation, competitive analysis, and strategic insights—into an engaging, scrollable, and easily digestible visual narrative.

The entire infographic is built within a single, self-contained HTML file, leveraging modern web technologies to deliver a professional and stylish data visualization experience.

🚀 Live Demo & Screenshot
(This is where you would place a link to a live deployment on GitHub Pages, Netlify, or Vercel.)

[Insert Live Demo Link Here]


(Suggestion: Add a screenshot of the infographic named screenshot.png to the repository root for this image to display.)

✨ Key Features & Data Visualized
This infographic provides a comprehensive analysis of the AI in Hospitality market, covering:

Market Overview: A high-level view of the market, including the Global Market Size ($4.7 Billion in 2024) and a Projected Growth Forecast to $18.3 Billion by 2030, visualized with a dynamic line chart.

Technology Segmentation: A detailed breakdown of the market by key AI technologies, using a doughnut chart to clearly show the dominance of AI Chatbots & Virtual Assistants.

Competitive Landscape: An insightful horizontal bar chart illustrating the market share distribution among key industry players, highlighting the fragmented nature of the market.

Adoption Rate Analysis: A stacked bar chart comparing the adoption rates of different AI technologies (Chatbots, Analytics, Personalization) across various hotel segments (Luxury, Mid-Range, Budget).

Strategic SWOT Analysis: A clean, four-column layout presenting the Strengths, Weaknesses, Opportunities, and Threats facing the industry.

AI Implementation Value Chain: A clear, step-by-step flowchart built with HTML and CSS, outlining the process from discovery to feedback.

🛠️ Technology Stack & Design Principles
This project was built with a specific set of modern technologies and design principles to ensure performance, responsiveness, and visual appeal without relying on common SVG-based libraries.

Frontend:

HTML5: The core structure of the single-page application.

Tailwind CSS: For all styling, layout, and responsiveness, enabling a utility-first approach that keeps the design clean and maintainable.

JavaScript (ES6+): For all interactivity, data handling, and chart initialization.

Data Visualization:

Chart.js: Used exclusively for all charts (Line, Doughnut, Bar, Stacked Bar). All charts are rendered to HTML Canvas elements, ensuring high performance and avoiding SVG. The implementation includes:

Full responsiveness to fit container dimensions.

Custom logic for wrapping long labels to maintain readability.

Customized tooltips for an enhanced user experience.

Design & Development Philosophy:

Single-Page Application (SPA): The content is presented in a single file to create a seamless, narrative-driven experience for the user, guiding them through the data story from top to bottom.

Material Design Aesthetics: The UI incorporates principles like elevation (shadows), clear typography, and a card-based layout to create a modern and professional feel.

No SVG / No Mermaid JS: A core technical constraint of this project was to avoid using SVG for graphics or Mermaid JS for diagrams. All visual elements, including the value chain flowchart and SWOT icons, are built using a combination of HTML structure, Tailwind CSS, and standard Unicode characters. This demonstrates a commitment to foundational web technologies and performance.

📂 How to Use
As this is a self-contained HTML file, no build process or server is required.

Clone the repository:

git clone https://github.com/your-username/ai-hospitality-infographic.git

Navigate to the project directory.

Open the index.html file (or the file containing the infographic code) directly in your web browser.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
