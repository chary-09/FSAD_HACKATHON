# ⚡ Quick Start - 30 Minute Setup

Get Bharat Airways running in 30 minutes. Follow this guide strictly in order.

---

## Prerequisites (Verify Before Starting)
```bash
node --version      # Should be v18+
npm --version       # Should be v9+
mysql --version     # Should be v8+
```

If any are missing, install from:
- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/mysql/
- MySQL GUI: https://www.mysql.com/products/workbench/

---

## Step 1: MySQL Database Setup (3 minutes)

### Windows Users
1. Open MySQL Workbench (installed with MySQL)
2. Click "MySQL Connections"
3. Click on "Local instance MySQL80" (or your MySQL connection)
4. Copy-paste this entire SQL block into the query window and execute (Ctrl+Enter):

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS bharat_airways CHARACTER SET utf8mb4;

-- Create user
CREATE USER IF NOT EXISTS 'bharat_user'@'localhost' IDENTIFIED BY 'BharatAirways123!';

-- Grant permissions
GRANT ALL PRIVILEGES ON bharat_airways.* TO 'bharat_user'@'localhost';
FLUSH PRIVILEGES;
```

5. You should see: `Query OK` messages

### macOS/Linux Users
```bash
# Start MySQL if not running
mysql.server start  # macOS
# or: sudo systemctl start mysql  # Linux
# or: brew services start mysql  # macOS with Homebrew

# Run database setup
mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS bharat_airways CHARACTER SET utf8mb4;
CREATE USER IF NOT EXISTS 'bharat_user'@'localhost' IDENTIFIED BY 'BharatAirways123!';
GRANT ALL PRIVILEGES ON bharat_airways.* TO 'bharat_user'@'localhost';
FLUSH PRIVILEGES;
EOF
```

---

## Step 2: Import Database Schema (2 minutes)

### All Users
Open terminal in project root and run:

```bash
# Make sure you're in the project root directory
cd "c:\Users\giriv\OneDrive\ドキュメント\FSAD-HACKATHON"

# Import schema (keep password terminal)
mysql -u bharat_user -p bharat_airways < backend/database/schema.sql

# When prompted for password, type: BharatAirways123!
```

✅ You should see table creation confirmations (no errors)

---

## Step 3: Backend Configuration (2 minutes)

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Open .env in your text editor and update these 4 lines only:
```

Open `backend/.env` and ensure these values are set:
```env
DB_USER=bharat_user
DB_PASSWORD=BharatAirways123!
JWT_ACCESS_SECRET=SuperSecretAccessKey123456789012345678901234567890
JWT_REFRESH_SECRET=SuperSecretRefreshKey123456789012345678901234567890
```

Save the file.

---

## Step 4: Frontend Configuration (2 minutes)

```bash
# Go back to project root
cd ..

# Navigate to frontend
cd frontend

# Copy environment template
cp .env.example .env
```

✅ The default `.env` is already configured correctly for local development

---

## Step 5: Install Dependencies (10 minutes)

### Terminal 1: Backend Dependencies
```bash
# From project root, navigate to backend
cd backend
npm install
```
⏳ Wait for completion (2-3 minutes)

### Terminal 2 (NEW): Frontend Dependencies
Open a new terminal in the project root:
```bash
cd frontend
npm install
```
⏳ Wait for completion (2-3 minutes)

---

## Step 6: Start All Services (Simultaneous - ALL 3 BELOW!)

### Terminal 1: MySQL (KEEP RUNNING)
```bash
# macOS/Linux
mysql.server start

# Windows - Already running from Workbench, just confirm:
mysql -u root -p -e "SELECT 1"
# Enter password if prompted
```
✅ Should show no errors

### Terminal 2: Backend Server
```bash
# From backend directory
cd backend
npm start
```

✅ **Wait for this message:**
```
✈️  Server running on port: 5000
Ready to accept connections...
```

### Terminal 3: Frontend Dev Server
```bash
# From frontend directory
cd frontend
npm run dev
```

✅ **Wait for this message:**
```
➜  Local:   http://localhost:3000/
```

---

## Step 7: Test the System (5 minutes)

1. **Open Browser**
   - Go to: http://localhost:3000
   - ✅ You should see the Bharat Airways homepage

2. **Register New User**
   - Click "Sign Up"
   - Fill in:
     - Name: `Test User`
     - Email: `test@example.com`
     - Phone: `9876543210`
     - Password: `TestPass123`
   - Click Submit
   - ✅ Should succeed

3. **Login**
   - Click Login
   - Email: `test@example.com`
   - Password: `TestPass123`
   - ✅ Should login successfully

4. **Search Flights**
   - From → DEL (Delhi)
   - To → BOM (Mumbai)
   - Date → Any future date
   - Passengers → 1
   - Click "Search Flights"
   - ✅ Should show available flights

5. **Complete Full Flow (Optional)**
   - Click "Select Flight" 
   - Select a seat
   - Click "Continue Booking"
   - Fill passenger info
   - Click "Confirm & Pay"
   - ✅ Should show confirmation

---

## Success! 🎉

All 3 services running:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000
- ✅ MySQL: localhost:3306

**You now have a fully functional flight booking system!**

---

## Common Issues & Quick Fixes

### "npm: command not found"
- Node.js not installed or not in PATH
- Fix: Restart terminal after installing Node.js

### "Port already in use" (Port 3000 or 5000)
- Another app using the port
- Fix: Change `VITE_API_URL` to `http://localhost:5001` and backend PORT to 5001 in `.env`

### "MySQL connection refused"
- MySQL not running
- Fix: Start MySQL (see Step 1)

### "Cannot find module" after npm install
- Incomplete install
- Fix:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Frontend shows "Cannot connect to backend"
- Backend not running
- Fix: Check all 3 terminals are running, restart backend (Ctrl+C, then npm start)

### Database import failed
- Wrong MySQL credentials
- Fix: Verify DB_USER and DB_PASSWORD in `.env` match Step 1

---

## Keep These 3 Terminals Running

| Terminal | Command | Port | Status |
|----------|---------|------|--------|
| #1 | MySQL Server | 3306 | ✅ Running |
| #2 | npm start (backend) | 5000 | ✅ Running |
| #3 | npm run dev (frontend) | 3000 | ✅ Running |

**Never close these terminals while developing!**

---

## Next: Start Development

Once everything is running:

1. **Modify Frontend**: Edit files in `frontend/src/pages/` → Auto-reload at http://localhost:3000
2. **Modify Backend**: Edit files in `backend/controllers/` → Restart server (Ctrl+C, npm start)
3. **Add Features**: Check documentation in `SETUP_GUIDE.md` and `README.md`

---

## Need Help?

- **Backend errors**: Check backend terminal output
- **Frontend errors**: Press F12 in browser for console errors
- **Database errors**: Use MySQL Workbench to verify tables
- **Full guide**: See `SETUP_GUIDE.md`
- **Architecture**: See `PROJECT_SUMMARY.md`

---

## That's It!

You should now have:
- ✅ Full-stack flight booking system
- ✅ Working database with sample data
- ✅ Running frontend and backend
- ✅ Ready to test and develop

**Estimated total time: 30 minutes from start to working system** ⚡

---

**Happy coding! 🚀**

*Bharat Airways Flight Booking System v1.0.0*
