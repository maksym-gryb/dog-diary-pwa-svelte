import { auth } from '$lib/firebase';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

export async function login() {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function logout() {
    await signOut(auth);
}
