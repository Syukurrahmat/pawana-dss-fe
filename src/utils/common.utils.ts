
export interface AnyObject {
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

export const toBase64 = (file: File | null) => new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const ISPUColor: AnyObject = {
    'Baik': 'green',
    'Sedang': 'blue',
    'Tidak Sehat': 'yellow',
    'Sangat Tidak Sehat': 'red',
    'Berbahaya': 'black',
};


export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
