const axios = require('axios');
const axiosRetry = require('axios-retry');

// Create custom Axios instance
const apiClient = axios.create({
  baseURL: env('ENDPOINT'),
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Authorization': 'Bearer '.env('token'),
    'Content-Type': 'application/json'
  }
});

// Retry failed requests up to 3 times (on network errors and 5xx)
axiosRetry(apiClient, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response && error.response.status >= 500;
  }
});

// Add a request interceptor
apiClient.interceptors.request.use(config => {
  console.log(` [${config.method.toUpperCase()}] Request to: ${config.url}`);
  return config;
}, error => {
  console.error(' Request error:', error);
  return Promise.reject(error);
});

// Add a response interceptor
apiClient.interceptors.response.use(response => {
  console.log(` Response from: ${response.config.url} | Status: ${response.status}`);
  return response;
}, error => {
  if (error.response) {
    console.error(` Error response from: ${error.config.url}`);
    console.error(`Status: ${error.response.status}, Data:`, error.response.data);
  } else {
    console.error(' Network/Server error:', error.message);
  }
  return Promise.reject(error);
});

// Example GET request
apiClient.get('/resource')
  .then(response => {
    console.log('Data:', response.data);
  })
  .catch(error => {
    console.error('Final error:', error.message);
  });