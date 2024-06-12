import { API_URL } from "@/constants/config";


export const pageDataFetcher = async (...args: Parameters<typeof fetch>) => {
    console.log(API_URL + args[0])
    return await fetch(API_URL + args[0], args[1])
        .then(e => e.json())
        .then(e => {
            if (!e.success) throw new Error("Not Found");
            return e.result
        })
};

export const apiFetcher = async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(API_URL + args[0], args[1]);
    return await res.json();
};

export const fetcher = async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(...args);
    return await res.json();
};


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

    console.log(baseURL);
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

    const hasQuery = new URL(baseURL).search.length > 0;
    const url = `${baseURL}${hasQuery ? "&" : "?"}${params.toString()}`;

    return url;
};
