# Historical Simulator

*Interactive decision-driven game that lets you rewrite key moments in history—manage resources, earn badges, and compare your outcomes to what really happened.*

---

# 🚀 Features

- *Multiple Scenarios*  
  – Fall of the Roman Republic, American Revolution, Indian Independence, Cuban Missile Crisis, Meiji Restoration  
- *Branching Decisions*  
  – Each choice impacts your treasury, military strength, and political stability  
- *Resource Management*  
  – Track your resources in real-time as you make strategic choices  
- *Outcome Comparison*  
  – See “Your Outcome” vs. the real historical outcome  
- *Achievements & Badges*  
  – Unlock badges (e.g. “Wealthy”, “War Hero”, “Peacemaker”) for hitting resource milestones  
- *Animated Timeline*  
  – Visualize key events as you progress  
- *Secure Full-Stack* 
  – Node.js/Express API with JWT auth, MySQL database, React + Framer Motion frontend  

---

# 📁 Structure
Historical_Simulation/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── scenarioController.js
│   │   └── gameController.js
│   ├── data/
│   │   ├── fall_roman_republic.json
│   │   ├── american_revolution.json
│   │   ├── indian_independence.json
│   │   ├── cuban_missile_crisis.json
│   │   └── meiji_restoration.json
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── gameRoutes.js
│   ├── seeds/
│   │   └── loadAllScenarios.js
│   ├── utils/
│   │   └── asyncHandler.js
│   └── server.js
└── frontend/
    ├── public/
    │   ├── index.html
    │   ├── manifest.json
    │   └── (favicon.ico, logo192.png, logo512.png)
    └── src/
        ├── api.js
        ├── App.js
        ├── index.js
        ├── theme.css
        ├── contexts/
        │   └── AuthContext.js
        └── components/
            ├── AchievementBadge.js
            ├── DecisionModal.js
            ├── ErrorBoundary.js
            ├── GameDashboard.js
            ├── Header.js
            ├── LoadingSpinner.js
            ├── LoadingSpinner.css
            ├── Login.js
            ├── Register.js
            ├── ResourcePanel.js
            ├── ScenarioList.js
            └── Timeline.js

---

# 🛠 Tech Stack

- *Backend:* Node.js, Express, MySQL (mysql2/promise), JWT authentication  
- *Frontend:* React, React Router, Axios, Framer Motion, CSS variables  
- *Dev Tools:* dotenv, express-rate-limit, helmet, cors, express-validator  

---

# 🔧 Prerequisites

- Node.js ≥ 14  
- MySQL server  
- npm or yarn  

---

# ⚙️ Setup Instructions

# 1. Clone the repo
git clone https://github.com/your-username/historical-simulator.git
cd historical-simulator

# 2. Backend

1. Copy & edit .env in backend/
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=historical_simulation
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

2. Install & seed:
cd backend
npm install
node seeds/loadAllScenarios.js

3. Start API:
npm start
or: node server.js

# 3. Frontend

1. Copy & edit .env in frontend/
REACT_APP_API_URL=http://localhost:5000/api
And Some Social Media links As you Wise.

2. Install & run:
cd ../frontend
npm install
npm start

🎮 Usage
1. Register a new account or log in.

2. Choose a scenario.

3. Make decisions—watch your resources update.

4. Unlock achievement badges.

5. Compare “Your Outcome” to real history.

6. Retry or explore another scenario!

🙏 Acknowledgments
- Inspired by history textbooks and strategy games

- Built with ❤️ using React, Express, and MySQL

- Logo assets generated with AI-assisted design