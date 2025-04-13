# Car Rental App

A mobile application built using **Rect Native (Expo)** and **Firebase** that replicates the core functionality of Turo - a peer-to-peer car rental platform.

This project is divided into two apps:
- **Owner App** - Allows car owners to list and manage bookings
- **Renter App** - Allows users to search and book available cars 

--- 

## Features

## Authentication 
- Firebase Authentication (email/password)
- Shared login screen for both apps
- Distinguishes between **Owner** and **Renter** roles
- Logout functionality

> Signup is handled manually via Firebase Console

---

### Owner App
- **Create Listings**
  - Add car model, license plate, price
  - Enter city + address
  - Upload car photo via **web URL**

- **Manage Bookings**
  - View bookings for owned cars 
  - See renter details and booking confirmation codes
  - Cancel bookings to remove them from the renter's side

---

### Renter App
- **Search for Cars**
  - Search by current city or input city manually
  - Listings shown on a **MapView** with price markers
  - Tap marker to view car details and book

- **Book Cars**
  - 1 active booking at a time
  - Auto-generates a **6-digit confirmation code**
  - Stores pickup location, car info, and owner details 

- **Manage Booking**
  - View current booking
  - Cancel existing booking from the app

---

## Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Firebase Authentication + Firestore 
- **Navigation:** React Navigation (Stack + Tab)
- **Maps:** react-native-maps

---

## Team Members 
| Aazain Rafiq | Nishnath Bandari | Shaswot Dhakal |
|--------------|------------------|----------------|

