# 🧠 TrueCost Backend

Backend service for **TrueCost Expense Management System**  
Built using **TypeScript + Express + MySQL**, deployed on **Railway**.

---

## 🚀 Tech Stack

- **Language:** TypeScript (Node.js)
- **Framework:** Express
- **Database:** MySQL (hosted on Railway)
- **ORM/Driver:** mysql2/promise
- **Authentication:** JWT + bcrypt
- **Hosting:** Railway
- **Environment Management:** dotenv

---

## 🗂 Folder Structure

TrueCost/
├── server/
│ ├── src/
│ │ ├── app.ts
│ │ ├── server.ts
│ │ ├── config/
│ │ │ └── db.ts
│ │ ├── modules/
│ │ │ ├── auth.routes.ts
│ │ │ ├── users.routes.ts
│ │ │ ├── expenses.routes.ts
│ │ │ ├── rules.routes.ts
│ │ │ └── approvals.routes.ts
│ │ └── testConnection.ts
│ ├── package.json
│ ├── tsconfig.json
│ ├── .gitignore
│ └── .env (local only)


---

## ⚙️ Local Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/TrueCost.git
cd TrueCost/server


npm install

Create a .env file inside /server:

If you want to connect locally (using Railway public MySQL):
MYSQLHOST=containers-xxxx.up.railway.app
MYSQLPORT=xxxxx
MYSQLUSER=root
MYSQLPASSWORD=your_mysql_password
MYSQLDATABASE=railway
PORT=8080
JWT_SECRET=super_secret_key

▶️ If you’re using Railway private network (recommended for deployed backend):
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=your_mysql_password
MYSQLDATABASE=railway
PORT=8080
JWT_SECRET=super_secret_key

Development Mode (auto-reload):
npm run dev

Build and Run:
npm run build
npm start

Visit:
http://localhost:8080/


Test Database Connection:
To verify MySQL connectivity:

-> npx ts-node src/testConnection.ts


✅ Expected Output:

✅ Connected to MySQL: [ { time: '2025-10-04T...' } ]

🛫 Deploying to Railway
1️⃣ Push to GitHub

Make sure your backend is inside the /server folder and committed.

2️⃣ Deploy

Go to Railway

Click New Project → Deploy from GitHub Repo

Choose your TrueCost repo

Set Root Directory = server

Railway will auto-detect Node.js

3️⃣ Add Environment Variables

In Railway → TrueCost → Variables:

MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=your_mysql_password
MYSQLDATABASE=railway
JWT_SECRET=super_secret_key
PORT=8080

4️⃣ Link MySQL

In Variables tab → Add Variable Reference → Select MySQL
This links your backend to the MySQL service internally.

5️⃣ Redeploy

Go to Deployments → Redeploy Latest Commit

✅ Logs should show:

✅ Connected to MySQL: [ { time: '...' } ]
✅ Server running on port 8080
