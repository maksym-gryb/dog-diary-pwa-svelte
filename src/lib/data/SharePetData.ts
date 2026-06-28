import { type SharePetType } from "./SharePetType";

export interface SharePetData {
    id: string,
    creatorId: string,
    petId: string,
    role: SharePetType,
    expiresAt: Date,
    maxUses: number,
    used: number,
    usedBy?: string
}