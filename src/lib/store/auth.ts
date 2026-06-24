import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const user = writable(null);
export const authLoading = writable(true);

onAuthStateChanged(auth, (firebaseUser) => {
    user.set(firebaseUser);
    authLoading.set(false);
});
