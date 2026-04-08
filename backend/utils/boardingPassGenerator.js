// ============================================================
// QR CODE AND PDF BOARDING PASS GENERATION
// ============================================================

const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create QR Code for boarding pass
async function generateBoardingPassQRCode(bookingData) {
    try {
        // Create data string for QR code
        const qrData = JSON.stringify({
            booking_reference: bookingData.booking_reference,
            passenger_name: bookingData.passenger_name,
            flight_number: bookingData.flight_number,
            seat_number: bookingData.seat_number,
            departure_time: bookingData.departure_time
        });

        // Generate QR code as data URL
        const qrCode = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 300,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return qrCode;
    } catch (error) {
        console.error('✗ Error generating QR code:', error.message);
        throw error;
    }
}

// Generate PDF Boarding Pass
async function generateBoardingPassPDF(bookingData, airlineData, qrCodeDataUrl) {
    try {
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `boarding-pass-${bookingData.booking_reference}.pdf`;
        const filePath = path.join(uploadDir, fileName);

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 30
            });

            const stream = fs.createWriteStream(filePath);

            doc.on('error', reject);
            stream.on('error', reject);
            stream.on('finish', () => resolve({ fileName, filePath, url: `/uploads/${fileName}` }));

            doc.pipe(stream);

            // Header
            doc.fillColor(airlineData.primary_color);
            doc.fontSize(24).font('Helvetica-Bold').text(airlineData.name, { align: 'center' });
            doc.fontSize(14).font('Helvetica').text('BOARDING PASS', { align: 'center' });

            doc.strokeColor(airlineData.primary_color).moveTo(50, 80).lineTo(550, 80).stroke();

            // Passenger Info Section
            doc.fillColor('#000000');
            doc.fontSize(10).font('Helvetica-Bold').text('PASSENGER', 50, 100);
            doc.fontSize(12).font('Helvetica').text(bookingData.passenger_name, 50, 115);

            // Booking Reference
            doc.fontSize(10).font('Helvetica-Bold').text('BOOKING REFERENCE', 300, 100);
            doc.fontSize(14).font('Helvetica-Bold').text(bookingData.booking_reference, 300, 115);

            // Flight Information Section
            doc.fontSize(11).font('Helvetica-Bold').text('FLIGHT INFORMATION', 50, 160);

            const flightInfoY = 180;
            doc.fontSize(9).font('Helvetica').text('Flight Number:', 50, flightInfoY);
            doc.fontSize(11).font('Helvetica-Bold').text(bookingData.flight_number, 150, flightInfoY);

            doc.fontSize(9).font('Helvetica').text('From:', 50, flightInfoY + 25);
            doc.fontSize(11).font('Helvetica-Bold').text(bookingData.origin, 150, flightInfoY + 25);

            doc.fontSize(9).font('Helvetica').text('To:', 300, flightInfoY + 25);
            doc.fontSize(11).font('Helvetica-Bold').text(bookingData.destination, 400, flightInfoY + 25);

            doc.fontSize(9).font('Helvetica').text('Departure:', 50, flightInfoY + 50);
            doc.fontSize(11).font('Helvetica-Bold').text(bookingData.departure_time, 150, flightInfoY + 50);

            doc.fontSize(9).font('Helvetica').text('Seat:', 300, flightInfoY + 50);
            doc.fontSize(11).font('Helvetica-Bold').text(bookingData.seat_number, 400, flightInfoY + 50);

            // QR Code
            if (qrCodeDataUrl) {
                const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
                doc.image(qrBuffer, 50, 300, { width: 120, height: 120 });
                doc.fontSize(9).font('Helvetica').text('Scan for details', 50, 430);
            }

            // Seat Class and Booking Details
            doc.fontSize(9).font('Helvetica').text('Seat Class:', 200, 300);
            doc.fontSize(11).font('Helvetica-Bold').text(bookingData.seat_class, 200, 320);

            doc.fontSize(9).font('Helvetica').text('Passenger Email:', 200, 360);
            doc.fontSize(10).font('Helvetica').text(bookingData.passenger_email, 200, 375);

            // Footer
            doc.strokeColor('#CCCCCC').moveTo(50, 480).lineTo(550, 480).stroke();
            doc.fontSize(8).font('Helvetica').fillColor('#666666').text('Please arrive at the airport 2 hours before departure. Thank you for flying with us!', 50, 495, { align: 'center' });

            doc.end();
        });
    } catch (error) {
        console.error('✗ Error generating boarding pass PDF:', error.message);
        throw error;
    }
}

// Generate complete boarding pass (QR + PDF)
async function generateBoardingPass(bookingData, airlineData) {
    try {
        // Generate QR code
        const qrCodeDataUrl = await generateBoardingPassQRCode(bookingData);

        // Generate PDF boarding pass
        const pdfResult = await generateBoardingPassPDF(bookingData, airlineData, qrCodeDataUrl);

        return {
            success: true,
            qrCode: qrCodeDataUrl,
            pdfUrl: pdfResult.url,
            fileName: pdfResult.fileName,
            filePath: pdfResult.filePath
        };
    } catch (error) {
        console.error('✗ Error generating boarding pass:', error.message);
        throw error;
    }
}

module.exports = {
    generateBoardingPassQRCode,
    generateBoardingPassPDF,
    generateBoardingPass
};
