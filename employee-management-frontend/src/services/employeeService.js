import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5037/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API endpoints
export const employeeAPI = {
  // GET all employees
  getAll: () => api.get('/Employees'),

  // GET employee by ID
  getById: (id) => api.get(`/Employees/${id}`),

  // CREATE new employee
  create: (employeeData) => api.post('/Employees', employeeData),

  // UPDATE employee
  update: (id, employeeData) => api.put(`/Employees/${id}`, employeeData),

  // DELETE employee
  delete: (id) => api.delete(`/Employees/${id}`),
};

export default api;
