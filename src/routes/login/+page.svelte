<script lang="ts">
  import { auth } from '$lib/firebase.ts.old';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';

  async function login() {
    error = '';

    try {
        console.log({email, password})
      await signInWithEmailAndPassword(auth, email, password);
      goto('/day');
    } catch (e) {
      error = 'Login failed';
      console.error(e);
    }
  }
</script>

<h1>Login</h1>

<input placeholder="Email" bind:value={email} />
<input placeholder="Password" type="password" bind:value={password} />

<button onclick={login}>Login</button>

{#if error}
  <p style="color:red">{error}</p>
{/if}