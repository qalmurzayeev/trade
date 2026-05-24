const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Get Telegram init data
const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  
  if (window.Telegram?.WebApp?.initData) {
    headers['x-telegram-init-data'] = window.Telegram.WebApp.initData;
  } else {
    // Development fallback
    headers['x-dev-mode'] = 'true';
    headers['x-telegram-id'] = '999888777';
    headers['x-telegram-name'] = 'Demo User';
    headers['x-telegram-username'] = 'demouser';
  }
  
  return headers;
};

const request = async (method, path, body = null) => {
  const options = {
    method,
    headers: getAuthHeaders(),
  };
  
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const api = {
  // Auth
  login: () => request('POST', '/auth/login'),
  completeOnboarding: (data) => request('POST', '/auth/onboarding', data),
  getMe: () => request('GET', '/auth/me'),
  
  // Courses
  getCourses: () => request('GET', '/courses'),
  getCourse: (id) => request('GET', `/courses/${id}`),
  getLesson: (courseId, lessonId) => request('GET', `/courses/${courseId}/lessons/${lessonId}`),
  completeLesson: (courseId, lessonId) => request('POST', `/courses/${courseId}/lessons/${lessonId}/complete`),
  submitHomework: (courseId, lessonId, content) => request('POST', `/courses/${courseId}/lessons/${lessonId}/homework`, { content }),
  getProgress: () => request('GET', '/courses/progress/all'),
  
  // Admin
  admin: {
    getUsers: () => request('GET', '/admin/users'),
    getCourses: () => request('GET', '/admin/courses'),
    createCourse: (data) => request('POST', '/admin/courses', data),
    updateCourse: (id, data) => request('PUT', `/admin/courses/${id}`, data),
    createModule: (data) => request('POST', '/admin/modules', data),
    createLesson: (data) => request('POST', '/admin/lessons', data),
    getAccess: () => request('GET', '/admin/access'),
    setAccess: (data) => request('POST', '/admin/access', data),
    setAdmin: (telegram_id, is_admin) => request('POST', '/admin/set-admin', { telegram_id, is_admin }),
  }
};
