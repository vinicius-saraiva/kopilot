# Kopilot — Privacy Notice

**Last updated:** February 2026

This Privacy Notice explains how Kopilot ("we", "us", "our") collects, uses, stores, and protects your personal information when you use the Kopilot application ("the App").

By using the App, you acknowledge that you have read and understood this Privacy Notice.

---

## 1. Information We Collect

### 1.1 Account Information

When you create an account, we collect:

- **Email address** — used to identify your account and communicate with you
- **Password** — stored only in hashed (encrypted) form; we never have access to your plain-text password

If you sign in using Google or Apple, we receive your name and email address from the respective provider. We do not receive or store your Google or Apple password.

### 1.2 Vehicle Information

When you add a vehicle, you may provide:

- Vehicle nickname, make, model, and year
- Current mileage (odometer reading)
- Last digit of your license plate
- State/region of registration

### 1.3 Maintenance & Regulatory Data

When you track maintenance or regulatory items, we store:

- Item names, types, and descriptions
- Due dates and service intervals (date-based and mileage-based)
- Completion records: date completed, mileage at completion, cost, and notes
- Links to external services you choose to associate (e.g., your insurance portal)

### 1.4 Fuel Data

When you log a fuel entry, we collect:

- Date of purchase
- Liters filled, total cost, and price per liter
- Fuel type (gasoline, ethanol, diesel, or CNG)
- Station name (optional)
- Odometer reading (optional)
- Whether the tank was filled to full
- Notes (optional)

### 1.5 Mechanic Visit Data

When you log a mechanic visit, we collect:

- Date of visit
- Cost (optional)
- Location / mechanic name (optional)
- Notes (optional)
- Invoice photo (optional)

### 1.6 Location & GPS Data

When you use the ride tracking feature, the App collects **real-time GPS data** from your device, including:

- Latitude and longitude coordinates
- Speed and direction of travel
- Timestamps for each recorded point

This data is collected **only while you actively record a ride** (by pressing the start button). The App does not track your location in the background or when the ride tracking feature is not in use.

Ride data is stored as a route (sequence of coordinates) along with computed statistics: total distance, duration, average speed, and maximum speed.

Your GPS coordinates are also sent to our mapping provider (Mapbox) to snap your route to actual roads. See Section 3 for details.

### 1.7 Photos

When you upload an invoice photo for a mechanic visit, the image is:

- Compressed and resized (maximum 1920px, target 1MB)
- Stored in our cloud storage infrastructure (hosted by Supabase)
- Associated with your vehicle and the specific mechanic visit

### 1.8 Device & Browser Information

We collect minimal device information:

- **Language preference** — stored locally on your device to remember your choice
- **Currency preference** — stored locally on your device
- **Session tokens** — stored locally on your device to keep you signed in

We do not use analytics tools, tracking pixels, or advertising identifiers. We do not fingerprint your device.

---

## 2. How We Use Your Information

We use your information solely to provide and improve the App's functionality:

| Purpose | Data used |
|---------|-----------|
| Authenticate you and secure your account | Email, password hash, OAuth tokens |
| Display your vehicle dashboard | Vehicle details, maintenance status, fuel stats, ride history |
| Send you maintenance and regulatory reminders | Due dates, service intervals, mileage data |
| Calculate fuel efficiency and spending trends | Fuel entries, odometer readings, costs |
| Record and display your driving routes | GPS coordinates, speed, timestamps |
| Store your mechanic visit records | Visit details, costs, invoice photos |
| Remember your preferences | Language and currency settings |

We do **not** use your data for:

- Advertising or marketing profiling
- Selling or renting to third parties
- Automated decision-making or profiling that produces legal effects
- Training artificial intelligence models

---

## 3. Third-Party Services

We use the following third-party services to operate the App:

### Supabase (Database & Storage)

All your data is stored on infrastructure provided by Supabase, Inc. This includes your account information, vehicle data, maintenance records, fuel entries, ride history, and uploaded photos.

- Supabase website: [https://supabase.com](https://supabase.com)
- Supabase privacy policy: [https://supabase.com/privacy](https://supabase.com/privacy)

### Mapbox (Maps & Route Matching)

When you record a ride, your GPS coordinates are sent to Mapbox to match your route to actual roads and display it on a map. Mapbox receives only the coordinates necessary to process the route — no account information, vehicle details, or other personal data.

- Mapbox website: [https://www.mapbox.com](https://www.mapbox.com)
- Mapbox privacy policy: [https://www.mapbox.com/legal/privacy](https://www.mapbox.com/legal/privacy)

### Google & Apple (Authentication)

If you choose to sign in with Google or Apple, your authentication is handled by the respective provider. We receive only your name and email address after you authorize access. We do not have access to any other data in your Google or Apple account.

- Google privacy policy: [https://policies.google.com/privacy](https://policies.google.com/privacy)
- Apple privacy policy: [https://www.apple.com/legal/privacy](https://www.apple.com/legal/privacy)

### Google Fonts (Typography)

The App loads the Outfit font from Google Fonts. This means your browser makes a request to Google's servers to download the font files. Google may receive your IP address and browser information as part of this request.

- Google Fonts privacy: [https://developers.google.com/fonts/faq/privacy](https://developers.google.com/fonts/faq/privacy)

---

## 4. Data Storage & Security

### Where your data is stored

Your data is stored on Supabase-managed infrastructure. Session tokens and preferences are stored locally on your device (browser localStorage).

### How your data is protected

- All data is transmitted over encrypted connections (HTTPS/TLS)
- Passwords are hashed before storage — we never store or have access to plain-text passwords
- Row-Level Security (RLS) ensures that you can only access your own data — no other user can see your vehicles, rides, fuel entries, or photos
- Authentication tokens are automatically refreshed and expire after a set period

### Offline access

The App may cache visual assets (images, fonts, stylesheets) on your device for faster loading and limited offline access. No personal data is cached for offline use — all vehicle, fuel, maintenance, and ride data requires an active internet connection.

---

## 5. Data Retention

We retain your data for as long as your account is active. Specifically:

- **Account data** — retained until you delete your account
- **Vehicle, maintenance, fuel, and ride data** — retained until you manually delete individual records or delete your account
- **Invoice photos** — retained until you manually delete them or delete your account
- **Session tokens** — automatically expire and are refreshed; cleared when you sign out

We do not automatically delete historical data. Your complete maintenance history, fuel records, and ride history remain available to you unless you choose to delete them.

---

## 6. Your Rights

Depending on your jurisdiction, you may have the following rights regarding your personal data:

- **Access** — request a copy of the data we hold about you
- **Correction** — update or correct inaccurate data
- **Deletion** — request deletion of your account and all associated data
- **Data portability** — request your data in a structured, commonly used format
- **Withdraw consent** — stop using the App at any time; revoke OAuth access through your Google or Apple account settings

To exercise any of these rights, contact us at the address provided in Section 9.

When you delete your account, we will delete all data associated with it, including vehicles, maintenance records, fuel entries, ride history, and uploaded photos. This action is irreversible.

---

## 7. Children's Privacy

The App is not intended for use by anyone under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.

---

## 8. Changes to This Notice

We may update this Privacy Notice from time to time. When we make changes, we will update the "Last updated" date at the top of this page. We encourage you to review this notice periodically.

For significant changes that affect how we use your data, we will notify you through the App or by email.

---

## 9. Contact

If you have questions about this Privacy Notice or want to exercise your data rights, contact us at:

**Email:** v.saraiva.andrade@gmail.com

---

*This Privacy Notice applies to the Kopilot application and related services.*
