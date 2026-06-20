const DB_NAME = 'dog-diary';
export const STORENAME_PETS = 'pets';
export const STORENAME_ACTIVITIES = 'activities';
const DB_VERSION = 4;

let db: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

export async function openDB(): Promise<IDBDatabase> {
    if (db) return Promise.resolve(db);

    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
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

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onerror = () => reject(request.error);
    });

    return dbPromise;
}

// export async function getAll(){
//     const db = await openDB();

//     return new Promise((resolve, reject) => {
        
//     });
// }

// export async function getItem(id: string) {
//     const db = await openDB();

//     return new Promise((resolve, reject) => {
//         const tx = db.transaction(STORE_NAME, 'readonly');
//         const store = tx.objectStore(STORE_NAME);

//         const req = store.get(id);

//         req.onsuccess = () => resolve(req.result);
//         req.onerror = () => reject(req.error);
//     });
// }

// export async function setItem(value: { id: string;[key: string]: any }) {
//     const db = await openDB();

//     return new Promise((resolve, reject) => {
//         const tx = db.transaction(STORE_NAME, 'readwrite');
//         const store = tx.objectStore(STORE_NAME);

//         const req = store.put(value);

//         req.onsuccess = () => resolve(true);
//         req.onerror = () => reject(req.error);
//     });
// }