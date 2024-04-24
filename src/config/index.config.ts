const mode : string = (import.meta as any).env.MODE

export const API_URL = mode === "development" ? "http://localhost:3000" : ""