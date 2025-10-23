/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface LibraryImage {
    id: number;
    dataUrl: string;
    createdAt: Date;
}

const DB_NAME = 'VirtualTryOnDB';
const STORE_NAME = 'library';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

const getDb = (): Promise<IDBDatabase> => {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };

            request.onsuccess = (event) => {
                resolve((event.target as IDBOpenDBRequest).result);
            };

            request.onerror = (event) => {
                reject(`Database error: ${(event.target as IDBOpenDBRequest).error}`);
            };
        });
    }
    return dbPromise;
};

export const addImageToLibrary = async (dataUrl: string): Promise<void> => {
    const db = await getDb();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.add({ dataUrl, createdAt: new Date() });
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getAllLibraryImages = async (): Promise<LibraryImage[]> => {
    const db = await getDb();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            // Sort descending by creation date
            resolve(request.result.sort((a: LibraryImage, b: LibraryImage) => b.createdAt.getTime() - a.createdAt.getTime()));
        };
        request.onerror = () => reject(request.error);
    });
};

export const deleteLibraryImage = async (id: number): Promise<void> => {
    const db = await getDb();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};
