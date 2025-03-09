# School Pool Frontend Documentation

## 1. Introduction

The School Pool Frontend is a React application designed to connect university students for ride-sharing purposes. It facilitates safe, affordable, and convenient transportation solutions by linking students who need rides with those who can provide them.  The application caters to Students, Drivers and Admins, each having dedicated sections.

## 2. Project Architecture

The frontend is built using:

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **React Router:** A library for navigation within the application.
*   **Tailwind CSS:** A utility-first CSS framework for styling.
*   **Axios:** A promise-based HTTP client for making API requests.
*   **Zod:** A TypeScript-first schema validation library.
*   **React Hook Form:** Library for form management and validation.
*   **Leaflet:** A JavaScript library for interactive maps.
*   **Vite:** A build tool for fast development.

The codebase is structured into the following main directories:

*   **`src/`:** Contains all the source code for the application.
    *   **`assets/`:** Static assets such as images and SVG files.
    *   **`components/`:** Reusable UI components.
        *   **`admin/`:** Components specific to the admin dashboard.
        *   **`auth/`:** Authentication-related components (Login, Register).
        *   **`common/`:** Shared components used throughout the application (LocationInput, MapLocationSelector).
        *   **`hooks/`**: Contains custom React hooks.
        *   **`layout/`:** Components for the main layout structure (Header, Footer).
    *   **`contexts/`:** React contexts for managing global state (e.g., AuthContext).
    *   **`hooks/`:** Custom React hooks (e.g., `useMapLocation`, `useScrollToHash`).
    *   **`pages/`:**  Top-level components representing different pages in the application.
        *   `profile/`: For user profile pages (view and settings).
        *   `rider/`:  For pages specific to the driver (rider) role.
        *   `rides/`: For pages related to ride scheduling, editing, and viewing.
        *   `user/`:   For pages specific to the student role.
    *   **`services/`:**  Modules for interacting with the backend API.
    *   **`styles/`:** Global CSS styles.
    *   **`types/`:** TypeScript type definitions.
    *   **`constants/`:**  Definitions for constant data like locations.
    *   **`utils/`:** Utility functions (e.g., leafletLoader, mapDebugUtils).
*   **`public/`:** Static assets served directly (e.g., `vite.svg`).

## 3. Key Components and Functionality

### 3.1. Authentication

*   **`src/components/auth/Login.tsx`:** Handles user login. It uses React Hook Form and Zod for form validation and interacts with the `userService` to authenticate users. Upon successful login, user data is stored in the `AuthContext` and the user is redirected to the appropriate dashboard based on their role.
*   **`src/components/auth/Register.tsx`:** Handles user registration.  Similar to Login, it uses React Hook Form and Zod for validation, calls the `userService` to create a new user, and then redirects to the login page. Drivers also upload images of driver license and photos.
*   **`src/contexts/AuthContext.tsx`:** Provides the `AuthContext`, which manages user authentication state (current user, login, logout).  It uses `localStorage` to persist user data across sessions.
*   **`src/components/ProtectedRoute.tsx`:**  A higher-order component that protects routes, ensuring that only authenticated users can access them.  If a user is not authenticated, they are redirected to the login page.
*   **`src/components/RouteGuard.tsx`:** A component that checks the user's role against allowed roles for a specific route. If the user's role is not authorized, they are redirected to their appropriate dashboard.

### 3.2. Ride Management

*   **`src/pages/rider/Dashboard.tsx`:**  The main dashboard for drivers. It displays scheduled rides, pending ride requests, and provides actions such as starting, completing, and canceling rides.  It interacts with `rideService` and `bookingService` to fetch and manage ride data.
*   **`src/pages/rides/ScheduleRide.tsx`:** Allows drivers to schedule new rides. It includes location input with map integration (using `MapLocationSelector`), date and time selection, and seat availability settings.
*   **`src/pages/rides/EditRide.tsx`:** Allows drivers to edit existing rides. Pre-populates forms using API requests and then handles submission to API endpoints.
*   **`src/components/common/MapLocationSelector.tsx`:**  A reusable component for selecting locations on a map. It integrates with Leaflet for map display and Nominatim for address search and reverse geocoding.
*   **`src/components/common/LocationSearchBar.tsx`:** Location search input field. Uses Nominatim API to search locations.

### 3.3. User Management

*   **`src/pages/user/Dashboard.tsx`:** The main dashboard for students. Displays available rides and allows booking requests.
*   **`src/pages/user/UserHistory.tsx`:** Displays past ride history for students, including completed and cancelled rides.
*   **`src/pages/profile/Profile.tsx`:** Displays the user's profile information.
*   **`src/pages/profile/Settings.tsx`:** Allows users to edit their profile information.
*   **`src/services/userService.ts`:** Handles API requests related to user accounts (login, registration, profile updates).

### 3.4. Admin Panel

*   **`src/components/admin/AdminDashboard.tsx`:**  Provides an overview of system statistics, such as the total number of students, drivers, and rides.
*   **`src/components/admin/StudentsManagement.tsx`:**  Allows administrators to manage student accounts (view, edit, delete).
*   **`src/components/admin/DriversManagement.tsx`:**  Allows administrators to manage driver accounts, including verifying driver information and approving driver status.
*   **`src/components/admin/AdminLogin.tsx`:** Used to Login the admin user.
*   **`src/components/admin/AdminLayout.tsx`:** Common admin panel layout.
*   **`src/components/admin/UsersTable.tsx`:** Used to display users (students and drivers). Can edit, delete, and verify a user.
*   **`src/components/admin/EditUserModal.tsx`:** Used to edit users information in a Modal.

### 3.5. Core Services

*   **`src/services/rideService.ts`:** Manages API requests related to rides (creating, retrieving, updating, deleting).
*   **`src/services/bookingService.ts`:** Manages API requests related to bookings (creating, retrieving, updating status).
*   **`src/services/ReviewService.ts`:** Manage reviews.
*   **`src/services/newsService.ts`:** Used to call a python-flask server to get News data.
*   **`src/services/rideUpdateService.ts`:** Used to send a update message to all passengers.

### 3.6. Geo-Location and Mapping
* Uses Leaflet and Nominatim API to search and display locations in a Map. The file contains the leafletLoader.ts, and mapDebugUtils.ts.

## 4. Data Flow

1.  **User Interaction:** The user interacts with UI components (e.g., filling out a login form, selecting a location on a map, scheduling a ride).
2.  **Component State Updates:**  Components update their internal state based on user input and API responses.
3.  **API Requests:** Components use services (e.g., `userService`, `rideService`) to make API requests to the backend.
4.  **Backend Processing:** The backend processes the requests (e.g., authenticating a user, creating a ride, updating a booking).
5.  **API Responses:** The backend sends responses back to the frontend.
6.  **State Management:** The frontend services handle API responses and update the application state (e.g., storing user data in `AuthContext`, updating the list of available rides).
7.  **UI Rendering:** React components re-render based on the updated state, reflecting the changes in the UI.

## 5. Configuration and Setup

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create `.env` files similar to `.env.example` for local development.
    *   `VITE_MAP_API_KEY`: API key for LocationIQ. (Required for location services)
    *   Backend URL will be `http://localhost:8081`

3.  **Run the Application:**

    ```bash
    npm run dev
    ```

    This starts the development server, and the application will be accessible at `http://localhost:5173`.

## 6. Folder Structure


school-pool-frontend/
├── .gitattributes
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── public
│ └── vite.svg
├── README.md
├── src
│ ├── App.css
│ ├── App.tsx
│ ├── assets
│ │ └── react.svg
│ ├── components
│ │ ├── admin
│ │ │ ├── AdminDashboard.tsx
│ │ │ ├── AdminLayout.tsx
│ │ │ ├── AdminLogin.tsx
│ │ │ ├── DriversManagement.tsx
│ │ │ ├── EditUserModal.tsx
│ │ │ ├── StudentsManagement.tsx
│ │ │ └── UsersTable.tsx
│ │ ├── auth
│ │ │ ├── Login.tsx
│ │ │ └── Register.tsx
│ │ ├── common
│ │ │ ├── LocationInput.tsx
│ │ │ ├── LocationSearchBar.tsx
│ │ │ ├── MapLocationSelector.tsx
│ │ │ ├── NewsModal.tsx
│ │ │ └── WaitlistBadge.tsx
│ │ ├── hooks
│ │ │ └── useScrollToHash.ts
│ │ ├── layout
│ │ │ ├── Footer.tsx
│ │ │ ├── Header.tsx
│ │ │ └── Layout.tsx
│ │ ├── ProtectedRoute.tsx
│ │ └── RouteGuard.tsx
│ ├── constants
│ │ └── locations.ts
│ ├── contexts
│ │ └── AuthContext.tsx
│ ├── hooks
│ │ └── useMapLocation.ts
│ ├── index.css
│ ├── main.tsx
│ ├── pages
│ │ ├── InfoPage.tsx
│ │ ├── LandingPage.tsx
│ │ ├── profile
│ │ │ ├── Profile.tsx
│ │ │ └── Settings.tsx
│ │ ├── rider
│ │ │ ├── Dashboard.tsx
│ │ │ ├── PreRideUpdate.tsx
│ │ │ └── RiderHistory.tsx
│ │ ├── rides
│ │ │ ├── EditRide.tsx
│ │ │ ├── RideCard.tsx
│ │ │ └── ScheduleRide.tsx
│ │ └── user
│ │ ├── BookingsList.tsx
│ │ ├── Dashboard.tsx
│ │ ├── RateRideModal.tsx
│ │ ├── RatingDetailsModal.tsx
│ │ └── UserHistory.tsx
│ ├── services
│ │ ├── adminService.ts
│ │ ├── api.ts
│ │ ├── bookingService.ts
│ │ ├── imageService.ts
│ │ ├── index.ts
│ │ ├── newsService.ts
│ │ ├── ReviewService.ts
│ │ ├── rideService.ts
│ │ ├── rideUpdateService.ts
│ │ └── userService.ts
│ ├── styles
│ │ └── leaflet-overrides.css
│ ├── types
│ │ ├── auth.ts
│ │ ├── enums.ts
│ │ ├── GeoJsonTypes.ts
│ │ ├── index.ts
│ │ ├── LocationInputTypes.ts
│ │ ├── LocationTypes.ts
│ │ └── models.ts
│ ├── utils
│ │ ├── leafletLoader.ts
│ │ └── mapDebugUtils.ts
│ └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

## 7. API Endpoints

The frontend interacts with the backend API through the services located in `src/services/`.  These services use Axios to make HTTP requests.  Key API endpoints include:

*   `/users/login`: User login.
*   `/users/register`: User registration.
*   `/users/{id}`: Get user information by ID.
*   `/rides`: Create, retrieve, update, and delete rides.
*   `/bookings`: Create, retrieve, and update bookings.
*   `/admin/users`: Retrieve, update, and delete user records (admin access).
*   `/admin/drivers/{id}/verify`: Verify a driver (admin access).

## 8. Future Enhancements

*   **Real-time Updates:** Integrate WebSockets for real-time ride updates and notifications.
*   **Payment Integration:**  Implement a payment gateway for online ride payments.
*   **Advanced Search Filters:** Add more advanced search filters for rides (e.g., specific locations, time ranges).
*   **Improved Mapping:** Enhance map functionality with features like route planning and distance calculation.
*   **Mobile App:** Create native iOS and Android apps using React Native.

## 9. Contribution Guidelines

1.  **Fork the repository.**
2.  **Create a new branch for your feature or bug fix.**
3.  **Write clear and concise code with appropriate comments.**
4.  **Follow the existing code style and conventions.**
5.  **Test your changes thoroughly.**
6.  **Submit a pull request with a detailed description of your changes.**

## 11. Additional Notes
* Binary files and some file extensions are not included in the packed representation. Please refer to the `Directory Structure` section for a complete list of file paths, including binary files.

This documentation provides a comprehensive overview of the School Pool Frontend application. It covers the key aspects of the project, from its architecture and functionality to its setup and contribution guidelines. This information should be valuable for developers working on the project, as well as anyone interested in learning more about the application.