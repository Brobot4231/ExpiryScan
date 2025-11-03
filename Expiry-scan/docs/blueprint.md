# **App Name**: ExpiryScan

## Core Features:

- Image Capture: Capture product images using the mobile device's camera.
- OCR and Date Extraction: Utilize Python and OpenCV to detect and extract expiration and manufacturing dates from product images.
- Date Calculation: Calculate the expiry date based on the manufacturing date and 'best before' duration if an explicit expiry date is not available.
- Expiry Date Verification: Compare the extracted or calculated expiry date with the current date to determine product validity using a reasoning tool.
- Real-time Expiry Status: Display the product's manufacturing date, expiry date and current date and status, along with the time remaining until expiration or since expiration.
- Expiry Alerts: Display a notification when a product is expired.
- Camera Flash Alert: Blink the camera flash 3 times accompanied by a warning sound when an item is found to be expired.

## Style Guidelines:

- Primary color: Soft Green (#90EE90) to evoke freshness and safety.
- Background color: Light Gray (#F0F0F0), for a clean and neutral base.
- Accent color: Pale Yellow (#FFFFE0), drawing user attention to important status details.
- Font: 'Inter', a sans-serif font known for its readability, to display clear expiry dates and status messages.
- Use minimalistic icons to represent product categories and settings.
- A clean, intuitive layout, focused on scan results, with clear sections for captured image and identified expiry information.
- Subtle transitions to acknowledge user actions, such as a smooth fade-in for scan results or alerts.