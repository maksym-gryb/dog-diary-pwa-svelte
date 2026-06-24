// src/lib/state/app.svelte.ts
import { writable } from 'svelte/store';

export const appState = writable({
    loading: false,
    syncing: false,
    message: "",
    checkSync: false,
    user: null,
    online: false
});
