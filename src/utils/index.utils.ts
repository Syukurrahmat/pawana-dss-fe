export const fetcher = async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(...args);
    return await res.json();
}


export const buildQueriesURL = (baseURL: string, queryParams: Record<string, string | number>) => {
    const params = new URLSearchParams();

    for (const key in queryParams) {
        if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
            params.append(key, queryParams[key].toString());
        }
    }

    const url = `${baseURL}?${params.toString()}`;

    return url;
};

export const capitalizeString = (str: string) => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

interface AnyObject {
    [key: string]: any;
}

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