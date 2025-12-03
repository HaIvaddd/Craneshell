/**
 * Craneshell API Module
 * Все функции для работы с backend API
 */

const API_URL = "http://localhost:8000/api";

// ===== UTILS =====
export async function makeRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API Error');
  }

  return response.json();
}

// ===== HEALTH =====
export async function checkHealth() {
  return makeRequest('/health');
}

// ===== AUTH =====
export async function register(username, email, password) {
  const data = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
  
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  return data;
}

export async function login(email, password) {
  const data = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// ===== CONFIGS =====
export async function createConfig(configData) {
  return makeRequest('/configs', {
    method: 'POST',
    body: JSON.stringify(configData)
  });
}

export async function getUserConfigs() {
  return makeRequest('/configs');
}

export async function getConfig(id) {
  return makeRequest(`/configs/${id}`);
}

export async function updateConfig(id, configData) {
  return makeRequest(`/configs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(configData)
  });
}

export async function deleteConfig(id) {
  return makeRequest(`/configs/${id}`, {
    method: 'DELETE'
  });
}

// ===== PUBLIC CONFIGS =====
export async function getPopularConfigs(limit = 20) {
  return makeRequest(`/public/popular?limit=${limit}`);
}

export async function searchConfigs(query, limit = 20) {
  return makeRequest(`/public/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

export async function getPublicConfig(id) {
  return makeRequest(`/public/configs/${id}`);
}
