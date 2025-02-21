import { API_URL } from "@/constants/config";
import axios from "axios";
import qs from "qs";

export const fetcher = async <T = any>(url: string, options?: RequestInit) => {
    try {
        const response = await fetch(API_URL + url, {
            // credentials: 'include',
            ...options
        });
        
        if(response.redirected){
            window.location.href = response.url;
        }

        if (!response.ok) throw new Error(response.statusText);

        const result: APIResponse<T> = await response.json();
        if (result.error) throw new Error(result.error);

        return result.data;

    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};

export function UrlWithQuery(baseUrl: string, additionalParams: Record<string, any>): string {
    const [urlPath, existingQuery] = baseUrl.split('?');
    const baseParams = qs.parse(existingQuery);
    const combinedParams = { ...baseParams, ...additionalParams };
    const queryString = qs.stringify(combinedParams);
    return `${urlPath}?${queryString}`;
}

export const myAxios = axios.create({
    baseURL: API_URL,
    // withCredentials: true,
    transformResponse: (e) => {
        const response = JSON.parse(e)
        return response.statusCode == 200 ? response.data : response
    },
});