import { API_URL } from "@/constants/config";
import axios from "axios";
import qs from "qs";

export const fetcher = async <T = any>(url: string, options?: RequestInit) => {
    console.log(API_URL + url)
    return await fetch(API_URL + url, options)
        .then(e => e.json())
        .then((e: APIResponse<T>) => {
            if (e.error) throw Error(e.error)
                
            return e.data
        })
        .catch((e)=>{
            throw Error(e)
        })
}


export function UrlWithQuery(baseUrl: string, additionalParams: Record<string, any>): string {
    const [urlPath, existingQuery] = baseUrl.split('?');
    const baseParams = qs.parse(existingQuery);
    const combinedParams = { ...baseParams, ...additionalParams };
    const queryString = qs.stringify(combinedParams);
    return `${urlPath}?${queryString}`;
}



export const myAxios = axios.create({
    baseURL: API_URL,

    transformResponse: (e) => {
        const response = JSON.parse(e)
        return response.statusCode == 200 ? response.data : response
    },
});