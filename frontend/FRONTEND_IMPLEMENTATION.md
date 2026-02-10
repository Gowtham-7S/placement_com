# 🎨 Frontend Implementation Documentation

This document details the step-by-step implementation of the frontend architecture for the Placement Intelligence Portal.

## 1. Project Initialization

- **Framework**: React.js (v18+)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Styling**: Plain CSS (Modular approach)

## 2. Core Architecture Implemented

### A. API Service Layer (`src/services/api.js`)
We implemented a centralized Axios instance to handle all HTTP requests.
- **Base URL**: Configured via environment variables (`REACT_APP_API_BASE_URL`).
- **Request Interceptor**: Automatically retrieves the JWT token from `localStorage` and attaches it to the `Authorization` header (`Bearer <token>`).
- **Response Interceptor**: Global error handling. Specifically watches for `401 Unauthorized` responses to automatically log the user out and redirect to the login page.

### B. Layout System (`src/components/layout/`)
We created a dashboard-style layout system that adapts to the user's role.

#### **Sidebar Component (`Sidebar.jsx`)**
- **Role-Based Rendering**: The sidebar accepts a `role` prop (`admin`, `student`, `junior`) and renders different navigation links accordingly.
  - **Admin**: Dashboard, Companies, Drives, Approvals, Analytics.
  - **Student**: Dashboard, Submit Experience, My Submissions, Drives.
  - **Junior**: Dashboard, Companies, Roadmap.
- **Active State**: Uses `NavLink` to automatically highlight the current active page.
- **Logout Functionality**: Integrated logout button that clears local storage and redirects to login.

#### **Styling (`Sidebar.css`)**
- Implemented a clean, professional sidebar design.
- Fixed position on the left side (`width: 260px`).
- Hover effects and active state styling for better UX.

## 3. Directory Structure

The frontend is organized as follows:

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx       # Role-based navigation
│   │   └── Sidebar.css       # Sidebar styles
│   └── guards/               # (Planned) Protected routes
├── services/
│   └── api.js                # Axios configuration
├── pages/                    # (Planned) View components
└── context/                  # (Planned) AuthContext
```

## 4. Next Steps

1.  **Auth Context**: Implement `AuthContext.js` to manage global user state and wrap the application.
2.  **Protected Routes**: Create a wrapper component to restrict access to routes based on the user role.
3.  **Page Implementation**:
    -   **Login Page**: Connect to `/api/auth/login`.
    -   **Dashboard**: Create role-specific dashboard widgets.
    -   **Experience Form**: Build the multi-step form for students.

## 5. Usage

To use the API service in any component:

```javascript
import api from '../services/api';

const fetchData = async () => {
  try {
    const response = await api.get('/some-endpoint');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```
