// src/lib/state/app.svelte.ts
import { writable } from 'svelte/store';
import type { User } from "firebase/auth";

export interface AppState {
  loading: boolean;
  syncing: boolean;
  hasSyncData: boolean;
  message: string;
  checkSync: boolean;
  user: User | null;
  online: boolean;
  loginProcess: boolean;
}

export const appState = writable<AppState>({
    loading: false,
    syncing: false,
    hasSyncData: false,
    message: "",
    checkSync: false,
    user: null,
    online: false,
    loginProcess: false
});
