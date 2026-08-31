import axios from 'axios';

const API_BASE_URL = 'http://localhost:5216/api/course'; // ✅ match your controller route

// Attach token automatically
const apiClient = axios.create({
  baseURL: API_BASE_URL
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('🔑 Token from localStorage:', token); // ✅ log token before sending

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('📡 Request:', config.method?.toUpperCase(), config.url);
  console.log('📤 Headers:', config.headers);

  return config;
});


export const getCourses = async () => {
  try {
    const response = await apiClient.get('/');
    console.log('✅ Courses fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching courses:', error.response?.status, error.message);
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await apiClient.get(`/${id}`);
    console.log(`✅ Course ${id} fetched:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching course ${id}:`, error.response?.status, error.message);
    throw error;
  }
};


export const createCourse = async (course) => {
  const response = await apiClient.post('/', course);
  return response.data;
};

export const updateCourse = async (id, course) => {
  await apiClient.put(`/${id}`, course);
};

export const deleteCourse = async (id) => {
  await apiClient.delete(`/${id}`);
};
