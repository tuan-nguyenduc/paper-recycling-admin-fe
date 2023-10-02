import * as queryString from 'querystring';
import { API_URL, TOKEN_KEY } from '../constants';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json'
  },
  paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = window.sessionStorage.getItem(TOKEN_KEY);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
}, (error) => {
  // Handle errors
  if (error.response) {
    error = {
      statusCode: error.response.status,
      message: error.response.data.message,
      error: error.response.data.error
    };
  }

  throw error;
});
export default axiosClient;