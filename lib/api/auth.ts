import { Auth } from "@/types";
import { fetchAPI } from "../api";

const BASE_API = "/auth";

export const login = (): Promise<Auth> => fetchAPI(`${BASE_API}/login`);
