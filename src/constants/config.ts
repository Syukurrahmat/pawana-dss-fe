//@ts-ignore
export const SERVER_URL = import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : "";
export const API_URL = SERVER_URL + "/api"
export const CENTER_OF_MAP = [-7.519794, 110.082142] as [number, number]
export const SUBS_LIMIT = 5