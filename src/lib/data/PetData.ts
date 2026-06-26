import type { SyncData } from "./SyncData";

export interface PetData extends SyncData {
    id?: string;
    name?: string;

    owners: string[];
    caretakers: string[];
}
