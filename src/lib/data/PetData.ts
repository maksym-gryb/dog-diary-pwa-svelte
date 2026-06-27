import type { SharePetType } from "./SharePetType";
import type { SyncData } from "./SyncData";

export interface PetData extends SyncData {
    id?: string;
    name?: string;

    members: Member[]
}

export interface Member {
    id: string,
    name: string,
    type: SharePetType
}