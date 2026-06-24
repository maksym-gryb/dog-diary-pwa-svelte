import { writable } from 'svelte/store';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '$lib/firebase';
import { appState } from '$lib/state/app.svelte';

// export const user = writable<User | null>(null);
// export const authLoading = writable(true);

onAuthStateChanged(auth, (firebaseUser) => {
    appState.update(state => ({
        ...state,
        user: firebaseUser,
        online: true
    }));
});
