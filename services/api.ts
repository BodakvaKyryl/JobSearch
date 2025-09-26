import axios from "axios";

const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const rapidApiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;
const jsearchApiBaseUrl = process.env.NEXT_PUBLIC_JSEARCH_API_BASE_URL;

const api = axios.create({
  baseURL: jsearchApiBaseUrl,
  headers: {
    "X-RapidAPI-Key": rapidApiKey,
    "X-RapidAPI-Host": rapidApiHost,
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      dataLength: JSON.stringify(response.data).length,
    });
    return response;
  },
  (error) => {
    console.error("Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
