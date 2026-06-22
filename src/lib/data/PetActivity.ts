import type { ActivityType } from "./activityTypes"

type PetActivity = {
    id: string,
    petId: string,
    type: ActivityType,
    date: string,
    time: string,
    syncStatus?: string,
    timestamp?: number,
    isDeleted?: boolean
}