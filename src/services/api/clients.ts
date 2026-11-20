import axios from "axios";

const BASE_URL = "http://localhost:5050/api/v1";

const defaultConfig = {
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
};

export const publicApi = axios.create(defaultConfig);

export const api = axios.create(defaultConfig);

export const authApi = axios.create(defaultConfig);
