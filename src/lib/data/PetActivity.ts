import type { ActivityType } from "./activityTypes"
import type { SyncData } from "./SyncData";

export interface PetActivity extends SyncData {
    id: string,
    petId: string,
    type: ActivityType,
    date: string,
    time: string,
}
