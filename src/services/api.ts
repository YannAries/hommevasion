import axios from "axios";
import { urlConst } from "../utilities/constants";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const api = axios.create({
  headers: defaultHeaders,
  baseURL: urlConst.API_BASE_URL,
  timeout: 30000,
});

export default api;
