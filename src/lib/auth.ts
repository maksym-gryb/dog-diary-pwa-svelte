import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { auth } from './firebase';
import { appState } from '$lib/state/app.svelte';
import { get } from 'svelte/store';

const provider = new GoogleAuthProvider();

export async function login() {
    if(get(appState).loginProcess) {
      return;
    }
    appState.update(state => ({
      ...state,
      loginRunning: true
    }));
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (err) {
        console.error(err);
        throw err;
    }
    finally{
        appState.update(state => ({
        ...state,
        loginRunning: false
        }));
    }
}

export async function logout() {
    await signOut(auth);
}
