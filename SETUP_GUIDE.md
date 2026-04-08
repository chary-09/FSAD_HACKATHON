# Bharat Airways - Complete Setup Guide

## Project Overview

Bharat Airways is a premium flight booking platform built with:
- **Backend**: Node.js + Express.js + MySQL
- **Frontend**: React + Vite + Tailwind CSS
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Payment**: Razorpay

## Quick Start

### 1. Database Setup

```bash
# Start MySQL server (Windows: use MySQL Command Line Client or MySQL Workbench)
# Or on Mac/Linux:
mysql.server start

# Create database and import schema
mysql -u root -p
> CREATE DATABASE bharat_airways;
> USE bharat_airways;
> SOURCE backend/database/schema.sql;
> EXIT;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Start the backend server
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env (default API URL should work: http://localhost:5000)

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## Project Structure

```
FSAD-HACKATHON/
├── backend/                    # Express.js backend
│   ├── config/                # Configuration files
│   │   ├── database.js       # MySQL connection pool
│   │   └── jwt.js            # JWT configuration
│   ├── controllers/           # Request handlers
│   ├── routes/               # API route definitions
│   ├── models/               # Database access layer
│   ├── services/             # Business logic
│   ├── middleware/           # Authentication, validation, error handling
│   ├── utils/                # Utilities (email, QR code, PDF generation)
│   ├── database/
│   │   └── schema.sql        # MySQL schema with 8 tables
│   ├── uploads/              # File uploads
│   ├── logs/                 # Application logs
│   ├── package.json
│   ├── .env                  # Environment variables (create from .env.example)
│   └── server.js             # Main entry point (to be created)
│
└── frontend/                  # React + Vite frontend
    ├── src/
    │   ├── pages/            # Page components
    │   ├── components/       # Reusable components
    │   ├── config/
    │   │   └── api.js       # Axios API client
    │   ├── App.jsx          # Main app with routing
    │   ├── index.css        # Global styles
    │   └── main.jsx         # Entry point
    ├── public/              # Static assets
    ├── tailwind.config.js   # Tailwind CSS config
    ├── vite.config.js       # Vite config
    ├── package.json
    ├── .env                 # Environment variables (create from .env.example)
    └── index.html          # HTML template
```

---

## Backend Configuration

### Database Schema
- **users**: User accounts with roles (user, admin, airline_staff)
- **airlines**: Airline companies (Air India, IndiGo, Vistara, etc.)
- **aircraft**: Aircraft configurations per airline
- **flights**: Flight schedules and pricing
- **seats**: Individual seat availability and pricing
- **bookings**: Passenger bookings and status
- **payments**: Payment transactions with Razorpay integration
- **notifications**: Email/SMS notification tracking

### Key Files

#### `server.js` (to be created)
Main server file that will:
- Initialize Express app
- Configure middleware (CORS, body-parser, etc.)
- Mount all routes
- Set up Socket.io for real-time updates
- Start server on port 5000

#### `config/database.js`
MySQL connection pool configuration with error handling

#### `config/jwt.js`
JWT token generation and verification functions

#### API Routes
- **auth**: Register, login, profile management
- **flights**: Search, details, availability
- **bookings**: Create, retrieve, cancel bookings
- **payments**: Initiate payment, webhooks, refunds
- **admin**: Airline/aircraft management, analytics

---

## Frontend Features

### Pages Implemented
1. **Home** - Landing page with search widget
2. **Search Results** - Flight listing and filtering
3. **Seat Selection** - Interactive airplane seat map
4. **Booking** - Passenger details and add-ons
5. **Confirmation** - Booking confirmation with boarding pass
6. **Login/Register** - User authentication
7. **Profile** - User profile and booking history
8. **Admin Dashboard** - Analytics and management

### Design System
- Material Design 3 inspired
- Color palette: Saffron (#8f4e00), Blue (#4b53bc), Green (#056e00)
- Fonts: Manrope (headlines), Inter (body)
- Responsive: Mobile-first, supports all devices

---

## API Endpoints

### Authentication
```
POST   /auth/register              Create new account
POST   /auth/login                 User login
POST   /auth/refresh               Refresh JWT token
GET    /auth/profile               Get user profile
PUT    /auth/profile               Update profile
POST   /auth/change-password       Change password
```

### Flights
```
POST   /flights/search             Search flights
GET    /flights/:id                Get flight details
GET    /flights/:id/seats          Get available seats
GET    /flights                    List all flights
POST   /flights                    Create flight (admin)
PATCH  /flights/:id/status         Update flight status (admin)
```

### Bookings
```
POST   /bookings                   Create booking
GET    /bookings/:id               Get booking details
GET    /bookings/user/my-bookings  User's bookings
DELETE /bookings/:id               Cancel booking
POST   /bookings/:id/boarding-pass Generate boarding pass
```

### Payments
```
POST   /payments/initiate          Initiate Razorpay payment
GET    /payments/:id               Get payment details
POST   /payments/success           Payment success webhook
POST   /payments/failure           Payment failure webhook
POST   /payments/:id/refund        Process refund (admin)
```

### Admin
```
GET    /admin/airlines             List airlines
POST   /admin/airlines             Create airline
GET    /admin/aircraft             List aircraft
POST   /admin/aircraft             Create aircraft
GET    /admin/analytics            Dashboard analytics
GET    /admin/revenue              Revenue reports
```

---

## Important Notes

### Backend .env
```
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Vihas@0811
DB_NAME=bharat_airways
DB_PORT=3306

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Server
PORT=5000
NODE_ENV=development
```

### Frontend .env
```
VITE_API_URL=http://localhost:5000
VITE_NODE_ENV=development
```

---

## Running the Application

### Development Mode

**Terminal 1 - Start MySQL:**
```bash
# Windows: use MySQL Workbench or command line
# Mac/Linux:
mysql.server start
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm install  # first time only
npm start    # runs on http://localhost:5000
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm install  # first time only
npm run dev  # runs on http://localhost:3000
```

Then open browser to `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm run build   # if you have a build script
npm start       # runs on specified PORT
```

**Frontend:**
```bash
cd frontend
npm run build   # creates dist/ folder
npm run preview # preview production build locally
# Deploy dist/ folder to hosting
```

---

## Testing Workflow

1. **Register Account**
   - Navigate to http://localhost:3000/register
   - Create your account

2. **Search Flights**
   - Enter search criteria (from/to cities, dates)
   - Click "Search Flights"

3. **Select Seat**
   - Browse available flights
   - Click "Select Flight"
   - Choose seat from interactive map

4. **Complete Booking**
   - Enter passenger details
   - Select add-ons
   - Choose payment method

5. **Confirm Payment**
   - Complete Razorpay payment
   - View booking confirmation

6. **Access Profile**
   - Navigate to profile page
   - View booking history

---

## Features Implemented

### Backend ✓
- [x] Database schema with 8 tables
- [x] JWT authentication with refresh tokens
- [x] All models (User, Flight, Seat, Booking, Payment, etc.)
- [x] All services with business logic
- [x] All controllers with request handlers
- [x] All routes with middleware
- [x] Email service (Nodemailer)
- [x] QR code & PDF generation
- [x] Razorpay payment integration
- [x] Role-based authorization
- [ ] Main server.js file (needs to be created)
- [ ] Socket.io real-time updates
- [ ] Database initialization script

### Frontend ✓
- [x] Home page with search widget
- [x] Flight search results
- [x] Seat selection interface
- [x] Booking form
- [x] Confirmation page
- [x] User authentication (login/register)
- [x] User profile page
- [x] Admin dashboard
- [x] Responsive design
- [x] Design system with Tailwind CSS
- [x] API client with axios
- [x] JWT token management

---

## Next Steps

1. **Create server.js** - Main Express app initialization
2. **Set up Socket.io** - Real-time seat availability updates
3. **Environment Variables** - Fill in all .env files
4. **Database** - Run schema.sql to initialize database
5. **Testing** - Test complete booking flow
6. **Deployment** - Deploy backend and frontend

---

## Troubleshooting

**MySQL Connection Error:**
- Ensure MySQL is running
- Check credentials in .env match MySQL setup
- Verify database exists

**Port Already in Use:**
- Backend: Change PORT in backend/.env
- Frontend: Change port in frontend/vite.config.js

**CORS Errors:**
- Ensure backend is running
- Check VITE_API_URL in frontend/.env
- Verify CORS middleware in backend

**Login Issues:**
- Check backend is running
- Verify user account exists in database
- Check JWT secrets in .env match

---

## Support

- **Bharat Airways** - Flight Booking & Reservation System
- **Project Type**: Full-stack MERN (Node.js variant)
- **Deploy Ready**: Yes (pending server.js creation)
- **Scalable**: Designed for production use

---

**© 2024 Bharat Airways - Elevating the Horizon** ✈️
