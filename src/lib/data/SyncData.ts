
export enum SyncStatus {
    pending,
    done
}

export interface SyncData {
    syncStatus: SyncStatus,
    timestamp: number,
    isDeleted: boolean
}
