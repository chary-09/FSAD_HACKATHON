-- ============================================================
-- AIRLINE FLIGHT BOOKING AND RESERVATION SYSTEM DATABASE (SQLite)
-- ============================================================

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT CHECK(role IN ('user', 'admin', 'airline_staff')) DEFAULT 'user',
    passport_number TEXT,
    date_of_birth DATE,
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- AIRLINES TABLE
-- ============================================================
CREATE TABLE airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    primary_color TEXT NOT NULL,
    secondary_color TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    airline_code TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- AIRCRAFT TABLE
-- ============================================================
CREATE TABLE aircraft (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    airline_id INTEGER NOT NULL,
    aircraft_name TEXT NOT NULL,
    aircraft_model TEXT NOT NULL,
    total_seats INTEGER NOT NULL,
    economy_seats INTEGER NOT NULL,
    business_seats INTEGER NOT NULL,
    manufacturing_year INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);

-- ============================================================
-- FLIGHTS TABLE
-- ============================================================
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    airline_id INTEGER NOT NULL,
    aircraft_id INTEGER NOT NULL,
    flight_number TEXT NOT NULL UNIQUE,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price_economy REAL NOT NULL,
    price_business REAL NOT NULL,
    available_seats INTEGER NOT NULL,
    total_seats INTEGER NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'delayed', 'boarding', 'departed', 'landed', 'cancelled')) DEFAULT 'scheduled',
    duration_minutes INTEGER,
    stops INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(id) ON DELETE CASCADE
);

-- ============================================================
-- SEATS TABLE
-- ============================================================
CREATE TABLE seats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_id INTEGER NOT NULL,
    seat_number TEXT NOT NULL,
    seat_class TEXT CHECK(seat_class IN ('economy', 'business')) NOT NULL,
    status TEXT CHECK(status IN ('available', 'booked', 'reserved', 'blocked')) DEFAULT 'available',
    reserved_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    UNIQUE(flight_id, seat_number)
);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    flight_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    booking_reference TEXT UNIQUE NOT NULL,
    status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    total_amount REAL NOT NULL,
    passenger_name TEXT NOT NULL,
    passenger_email TEXT NOT NULL,
    passenger_phone TEXT,
    passenger_passport TEXT,
    boarding_pass_generated BOOLEAN DEFAULT 0,
    boarding_pass_url TEXT,
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT CHECK(payment_method IN ('credit_card', 'debit_card', 'net_banking', 'upi', 'wallet')) NOT NULL,
    payment_status TEXT CHECK(payment_status IN ('pending', 'success', 'failed', 'refunded')) DEFAULT 'pending',
    transaction_id TEXT UNIQUE,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    card_last_four TEXT,
    upi_id TEXT,
    attempt_count INTEGER DEFAULT 0,
    error_message TEXT,
    processed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    booking_id INTEGER,
    notification_type TEXT CHECK(notification_type IN ('booking_confirmation', 'payment_success', 'boarding_pass', 'flight_update', 'cancellation', 'refund', 'reminder')) NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    email_sent BOOLEAN DEFAULT 0,
    sms_sent BOOLEAN DEFAULT 0,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_airlines_code ON airlines(airline_code);
CREATE INDEX idx_aircraft_airline ON aircraft(airline_id);
CREATE INDEX idx_flights_airline ON flights(airline_id);
CREATE INDEX idx_flights_number ON flights(flight_number);
CREATE INDEX idx_flights_route ON flights(origin, destination);
CREATE INDEX idx_flights_departure ON flights(departure_time);
CREATE INDEX idx_flights_status ON flights(status);
CREATE INDEX idx_seats_flight ON seats(flight_id);
CREATE INDEX idx_seats_status ON seats(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_flight ON bookings(flight_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================================
-- SAMPLE DATA INSERTION
-- ============================================================

-- Insert Airlines
INSERT INTO airlines (name, primary_color, secondary_color, logo_url, airline_code, description, is_active) VALUES
('Air India', '#003DA5', '#FFFFFF', 'https://example.com/air-india.png', 'AI', 'National carrier of India', 1),
('IndiGo', '#4B0082', '#FFFFFF', 'https://example.com/indigo.png', 'IG', 'Leading low-cost carrier', 1),
('Vistara', '#4169E1', '#FFFFFF', 'https://example.com/vistara.png', 'UK', 'Full-service airline', 1),
('SpiceJet', '#FFD700', '#000000', 'https://example.com/spicejet.png', 'SG', 'Budget airline', 1),
('Akasa Air', '#FF6B35', '#FFFFFF', 'https://example.com/akasa.png', 'QP', 'New generation airline', 1);

-- Insert Aircraft
INSERT INTO aircraft (airline_id, aircraft_name, aircraft_model, total_seats, economy_seats, business_seats, manufacturing_year, is_active) VALUES
(1, 'VT-AIX', 'Boeing 787-8 Dreamliner', 254, 218, 36, 2015, 1),
(1, 'VT-AIY', 'Airbus A320', 180, 150, 30, 2018, 1),
(2, 'VT-IGL', 'Airbus A320', 180, 150, 30, 2017, 1),
(2, 'VT-IGM', 'Airbus A320neo', 189, 159, 30, 2019, 1),
(3, 'VT-TSC', 'Airbus A320', 180, 150, 30, 2016, 1),
(4, 'VT-SPI', 'Boeing 737 MAX 8', 189, 159, 30, 2019, 1),
(5, 'VT-AKA', 'Airbus A320neo', 189, 159, 30, 2023, 1);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
