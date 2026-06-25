import { SyncData } from "./SyncData"

interface PetData extends SyncData {
    id?: string;
    name?: string;

    owners: string[];
    caretakers: string[];
}
