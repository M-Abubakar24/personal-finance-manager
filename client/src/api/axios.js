import axios from "axios";

const API = axios.create({
  baseURL: "https://personal-finance-manager-production-362a.up.railway.app/api",
});

export default API;