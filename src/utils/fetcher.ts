import { API_URL } from "@/constants/config";
import axios from "axios";
import qs from "qs";

export const fetcher = async <T = any>(url: string, options?: RequestInit) => {
    return await fetch(API_URL + url, options)
        .then(e => e.json())
        .then((e: APIResponse<T>) => {
            if (e.error) throw Error(e.error)
            return e.data
        })
}

export const baseFetcher = async <T = any>(url: string, options?: RequestInit) => {
    return await fetch(url, options)
        .then(e => e.json())
        .then((e: APIResponse<T>) => {
            if (e.error) throw Error(e.error)
            return e.data
        })
}

export function UrlWithQuery(baseUrl: string, additionalParams: Record<string, any>): string {
    const [urlPath, existingQuery] = baseUrl.split('?');
    const baseParams = qs.parse(existingQuery);
    const combinedParams = { ...baseParams, ...additionalParams };
    const queryString = qs.stringify(combinedParams);
    return `${urlPath}?${queryString}`;
}

export const fetcherAPIWithQueries = async (baseURL: string, queries: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();

    for (const key in queries) {
        if (Object.prototype.hasOwnProperty.call(queries, key)) {
            const value = queries[key];
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        }
    }

    baseURL = API_URL + baseURL;

    const hasQuery = new URL(baseURL).search.length > 0;
    const url = `${baseURL}${hasQuery ? "&" : "?"}${params.toString()}`;

    const res = await fetch(url);
    return await res.json();
};

export const fetcherWithQueries = async (baseURL: string, queries: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();

    for (const key in queries) {
        if (Object.prototype.hasOwnProperty.call(queries, key)) {
            const value = queries[key];
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        }
    }

    const hasQuery = new URL(baseURL).search.length > 0;
    const url = `${baseURL}${hasQuery ? "&" : "?"}${params.toString()}`;


    const res = await fetch(url);
    return await res.json();
};

export const buildQueriesURL = (baseURL: string, queries: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();

    for (const key in queries) {
        if (Object.prototype.hasOwnProperty.call(queries, key)) {
            const value = queries[key];
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        }
    }

    const hasQuery = new URL(baseURL, window.location.origin).search.length > 0;
    const url = `${baseURL}${hasQuery ? "&" : "?"}${params.toString()}`;

    return url;
};


export const myAxios = axios.create({
    baseURL: API_URL,
    
    transformResponse: (e) => {
        const response = JSON.parse(e)
        return response.data
    },
    
});