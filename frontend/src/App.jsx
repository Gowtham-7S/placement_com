import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Protected/ProtectedRoute';

// Pages
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import CompanyManagement from './components/Admin/CompanyManagement';
import DriveManagement from './components/Admin/DriveManagement';
import PendingApprovals from './components/Admin/PendingApprovals';
import AdminAnalytics from './components/Admin/AdminAnalytics';
import StudentDashboard from './components/Student/StudentDashboard';
import SubmitExperience from './components/Student/SubmitExperience';
import MyExperiences from './components/Student/MyExperiences';
import ExperienceDetail from './components/Student/ExperienceDetail';
import JuniorDashboard from './components/Junior/JuniorDashboard';
import CompanyBrowser from './components/Junior/CompanyBrowser';
import PreparationRoadmap from './components/Junior/PreparationRoadmap';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/companies"
            element={<ProtectedRoute requiredRole="admin"><CompanyManagement /></ProtectedRoute>}
          />
          <Route
            path="/admin/drives"
            element={<ProtectedRoute requiredRole="admin"><DriveManagement /></ProtectedRoute>}
          />
          <Route
            path="/admin/approvals"
            element={<ProtectedRoute requiredRole="admin"><PendingApprovals /></ProtectedRoute>}
          />
          <Route
            path="/admin/analytics"
            element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>}
          />

          {/* Student Routes */}
          <Route
            path="/student"
            element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>}
          />
          <Route
            path="/student/submit-experience"
            element={<ProtectedRoute requiredRole="student"><SubmitExperience /></ProtectedRoute>}
          />
          <Route
            path="/student/experiences"
            element={<ProtectedRoute requiredRole="student"><MyExperiences /></ProtectedRoute>}
          />
          <Route
            path="/student/experience/:id"
            element={<ProtectedRoute requiredRole="student"><ExperienceDetail /></ProtectedRoute>}
          />

          {/* Junior Routes */}
          <Route
            path="/junior"
            element={<ProtectedRoute requiredRole="junior"><JuniorDashboard /></ProtectedRoute>}
          />
          <Route
            path="/junior/companies"
            element={<ProtectedRoute requiredRole="junior"><CompanyBrowser /></ProtectedRoute>}
          />
          <Route
            path="/junior/roadmap"
            element={<ProtectedRoute requiredRole="junior"><PreparationRoadmap /></ProtectedRoute>}
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
