const DB_NAME = 'dog-diary';
export const STORENAME_PETS = 'pets';
export const STORENAME_ACTIVITIES = 'activities';
const DB_VERSION = 4;

export function openDB(): IDBOpenDBRequest {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(STORENAME_PETS)) {
            database.createObjectStore(STORENAME_PETS, { keyPath: 'id', autoIncrement: true });
        }

        if (!database.objectStoreNames.contains(STORENAME_ACTIVITIES)) {
            database.createObjectStore(STORENAME_ACTIVITIES, { keyPath: 'id', autoIncrement: true });
        }
    };

    return request;
}