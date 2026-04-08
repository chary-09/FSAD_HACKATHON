# Bharat Airways Frontend

Modern React-based frontend for the Bharat Airways flight booking system, built with Vite, React Router, and Tailwind CSS.

## Design System

The UI uses a sophisticated Material Design 3-inspired color palette with Indian patriotic elements:

- **Primary Color**: #8f4e00 (Saffron)
- **Primary Container**: #ff9933 (Bright Saffron)
- **Secondary**: #4b53bc (Deep Blue)
- **Tertiary**: #056e00 (Green)

## Features

✈️ **Flight Search & Booking**
- Real-time flight search
- Interactive seat selection
- Multi-step booking with payment integration

👤 **User Management**
- Registration and authentication
- JWT-based session management
- User profile management
- Loyalty program tracking

📊 **Admin Dashboard**
- Flight management
- Booking analytics
- Revenue tracking
- Airline operations

🎨 **Premium UI**
- Responsive design (mobile, tablet, desktop)
- Glass-morphism effects
- Smooth animations
- Material Symbols icons

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── SearchResultsPage.jsx
│   │   ├── SeatSelectionPage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── ConfirmationPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── AdminDashboard.jsx
│   ├── config/
│   │   └── api.js          # Axios API client
│   ├── App.jsx             # Main app with routing
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── package.json           # Dependencies
└── index.html            # HTML template
```

## Installation & Setup

### Prerequisites

- Node.js 16+ 
- npm or yarn

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Configure the backend API URL:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist` folder.

## Pages Overview

### 1. **Home Page** (`/`)
- Hero section with flight search widget
- Featured deals carousel
- Premium service information

### 2. **Search Results** (`/search`)
- Flight list with filtering
- Airline-specific branding
- Real-time availability

### 3. **Seat Selection** (`/flights/:flightId/seats`)
- Interactive 2D airplane layout
- Color-coded seat availability
- Price breakdown summary

### 4. **Booking** (`/booking`)
- Passenger information form
- Add-ons selection (baggage, meals, priority)
- Payment method selection

### 5. **Confirmation** (`/confirmation/:bookingId`)
- Premium boarding pass card
- QR code for check-in
- Booking reference
- Next steps & offers

### 6. **Profile** (`/profile`)
- User information management
- Loyalty program status
- Booking history
- Travel preferences

### 7. **Admin Dashboard** (`/admin`)
- Key metrics (bookings, revenue, active flights)
- Recent bookings table
- Flight management controls

## API Integration

The frontend communicates with the backend using Axios. The API client is configured in `src/config/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000',
})

// Automatically adds JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Key API Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /flights/search` - Search flights
- `GET /flights/{id}/seats` - Get available seats
- `POST /bookings` - Create booking
- `GET /bookings/{id}` - Get booking details
- `POST /payments/initiate` - Initiate payment

## Authentication Flow

1. User registers or logs in
2. Backend returns `accessToken` and `refreshToken`
3. Tokens stored in localStorage
4. JWT token automatically added to all API requests
5. On token expiry, refresh token used to get new access token
6. User redirected to login if refresh fails

## Styling & Design

### Tailwind CSS

The project uses Tailwind CSS with custom color tokens matching the Material Design 3 system. Custom configuration in `tailwind.config.js`:

```javascript
colors: {
  primary: '#8f4e00',
  'primary-container': '#ff9933',
  secondary: '#4b53bc',
  tertiary: '#056e00',
  // ... + 30 more tokens
}

fontFamily: {
  headline: ['Manrope'],
  body: ['Inter'],
}
```

### Custom CSS Classes

Global utility classes in `src/index.css`:

- `.glass-panel` - Glassmorphism effect
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.tricolor-border` - Indian flag-inspired border

## Responsive Design

Built mobile-first with breakpoints:

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

All pages are fully responsive and tested on:
- Mobile (iPhone, Android)
- Tablet (iPad, Android tablets)
- Desktop (1920px+)

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of route components
- Image optimization
- Minified CSS/JS in production
- Caching headers for static assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000 |

## Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Submit pull request

## Troubleshooting

### CORS Errors
- Ensure backend API is running on port 5000
- Check CORS configuration in backend
- Verify `VITE_API_URL` in `.env`

### Login Issues
- Check user credentials
- Verify backend authentication is working
- Clear localStorage and try again

### Payment Failures
- Ensure Razorpay credentials in backend `.env`
- Check payment gateway configuration
- Review browser console for error details

## License

© 2024 Bharat Airways. All rights reserved.

## Support

For issues or questions:
- Check the [Backend README](../backend/README.md)
- Review API documentation
- Check browser console for errors

---

**Elevating the Horizon** ✈️
