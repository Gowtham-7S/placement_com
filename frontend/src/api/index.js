import axiosInstance from './axiosConfig';

// Authentication APIs
export const authAPI = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
  getProfile: () => axiosInstance.get('/auth/me'),
  updateProfile: (userData) => axiosInstance.put('/auth/profile', userData),
  logout: () => axiosInstance.post('/auth/logout'),
};

// Company APIs
export const companyAPI = {
  getAll: (params) => axiosInstance.get('/admin/companies', { params }),
  getById: (id) => axiosInstance.get(`/admin/companies/${id}`),
  create: (data) => axiosInstance.post('/admin/companies', data),
  update: (id, data) => axiosInstance.put(`/admin/companies/${id}`, data),
  delete: (id) => axiosInstance.delete(`/admin/companies/${id}`),
  // Public API
  searchPublic: (params) => axiosInstance.get('/public/companies', { params }),
};

// Drive APIs
export const driveAPI = {
  getAll: (params) => axiosInstance.get('/admin/drives', { params }),
  getById: (id) => axiosInstance.get(`/admin/drives/${id}`),
  create: (data) => axiosInstance.post('/admin/drives', data),
  update: (id, data) => axiosInstance.put(`/admin/drives/${id}`, data),
  delete: (id) => axiosInstance.delete(`/admin/drives/${id}`),
  // Public API
  searchPublic: (params) => axiosInstance.get('/public/drives', { params }),
};

// Experience APIs
export const experienceAPI = {
  submit: (data) => axiosInstance.post('/student/experience', data),
  getMyExperiences: (params) => axiosInstance.get('/student/experiences', { params }),
  getById: (id) => axiosInstance.get(`/student/experience/${id}`),
  update: (id, data) => axiosInstance.put(`/student/experience/${id}`, data),
  delete: (id) => axiosInstance.delete(`/student/experience/${id}`),
};

// Admin Approval APIs
export const approvalAPI = {
  getPending: (params) => axiosInstance.get('/admin/submissions/pending', { params }),
  approve: (id, data) => axiosInstance.post(`/admin/submissions/${id}/approve`, data),
  reject: (id, data) => axiosInstance.post(`/admin/submissions/${id}/reject`, data),
};

// Analytics APIs
export const analyticsAPI = {
  getTopics: () => axiosInstance.get('/admin/analytics/topics'),
  getDifficulty: () => axiosInstance.get('/admin/analytics/difficulty'),
  getSkills: () => axiosInstance.get('/admin/analytics/skills'),
  getCompanyRate: () => axiosInstance.get('/admin/analytics/company-rate'),
};
