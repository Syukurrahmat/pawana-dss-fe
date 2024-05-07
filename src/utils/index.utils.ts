import { UseToastOptions, useToast } from "@chakra-ui/react";
import moment from "moment";
interface AnyObject {
    [key: string]: any;
}

export const fetcher = async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(...args);
    return await res.json();
}


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

    const hasQuery = new URL(baseURL).search.length > 0
    const url = `${baseURL}${hasQuery ? "&" : "?"}${params.toString()}`;


    const res = await fetch(url);
    return await res.json();
}

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

    const hasQuery = new URL(baseURL).search.length > 0
    const url = `${baseURL}${hasQuery ? "&" : "?"}${params.toString()}`;

    return url;
};

export const compareObjects = (obj1: AnyObject, obj2: AnyObject) => {
    const uniqueValues: AnyObject = {};

    Object.keys(obj1).forEach(key => {
        if (obj1[key] !== obj2[key]) {
            uniqueValues[key] = obj1[key];
        }
    });

    Object.keys(obj2).forEach(key => {
        if (obj1[key] !== obj2[key]) {
            uniqueValues[key] = obj2[key];
        }
    });

    return uniqueValues;
}


export const trimAllValues = (obj: AnyObject) => {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object') {
            obj[key] = trimAllValues(obj[key] as AnyObject); // Rekursif untuk objek dalam objek
        }
    }
    return obj;
}


export const buildMapURL = (latitude: number, longitude: number): string => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
};


export const toFormatedDate = (str: string | undefined|null) => str ? moment(str).format('DD MMM YYYY') : ""