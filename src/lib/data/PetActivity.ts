import type { ActivityType } from "./activityTypes"
import { SyncData } from "./SyncData"

interface PetActivity extends SyncData {
    id: string,
    petId: string,
    type: ActivityType,
    date: string,
    time: string,
}
