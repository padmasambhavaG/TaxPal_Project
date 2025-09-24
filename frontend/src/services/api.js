const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });
  } catch (networkError) {
    throw new Error('Unable to reach the server. Please check your connection.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.details = data.errors || null;
    throw error;
  }

  return data;
};

export const signup = (payload) =>
  request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const login = (payload) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const forgotPassword = (payload) =>
  request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const verifyResetCode = (payload) =>
  request('/auth/verify-reset-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const resetPassword = (payload) =>
  request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export default {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
