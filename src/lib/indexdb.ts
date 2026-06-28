import type { Member } from "./data/PetData";

const DB_NAME = 'dog-diary';
export const STORENAME_PETS = 'pets';
export const STORENAME_ACTIVITIES = 'activities';
export const STORENAME_SHARE = 'pet_share';
const DB_VERSION = 7;

export function openDB(): IDBOpenDBRequest {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (ev) => {
        const db = request.result;
        const tx = (ev.target as IDBOpenDBRequest).transaction;

        // --------------------
        // BASE INIT
        // --------------------
        if (!db.objectStoreNames.contains(STORENAME_PETS)) {
            db.createObjectStore(STORENAME_PETS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORENAME_ACTIVITIES)) {
            db.createObjectStore(STORENAME_ACTIVITIES, { keyPath: 'id' });
        }

        // --------------------
        // v7 MIGRATION
        // pets migrations
        // pets.owners + pets.caretakers => pets.members
        // --------------------
        if(ev.oldVersion < 7) {
            const petsStore = tx!.objectStore("pets");

            const getAllReq = petsStore.getAll();

            getAllReq.onsuccess = () => {
                const pets = getAllReq.result;

                for (const pet of pets) {
                    const members: Member[] = []

                    for(const memberId of pet.owners) {
                        members.push({
                            id: memberId,
                            name: "",
                            type: "owner"
                        })
                    }

                    for(const memberId of pet.caretakers) {
                        members.push({
                            id: memberId,
                            name: "",
                            type: "caretaker"
                        })
                    }

                const migrated = {
                    ...pet,

                    members: members,
                    timestamp: Date.now()
                };

                delete migrated.owners;
                delete migrated.caretakers;

                petsStore.put(migrated);
                }
            };
        }
    };

    return request;
}
