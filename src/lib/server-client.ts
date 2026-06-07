import axios from "axios";
import { headers } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export const serverClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

serverClient.interceptors.request.use(async (config) => {
  const headersList = await headers();
  config.headers.cookie = headersList.get("cookie") ?? "";
  return config;
});
