<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { appState } from "$lib/state/app.svelte";
  import "$lib/store/auth";// required for hooking onAuthStateChange(...)
  // import { onMount } from 'svelte';

  // onMount(async () => {
  //   if ('serviceWorker' in navigator) {
  //     await navigator.serviceWorker.register('/service-worker.js');
  //   } else {
  //     alert("NO SERVICE WORKER AVAILABLE");
  //   }
  // });

  function syncToFirestore() {
    console.error("TODO: SYNC-TO-FIRESTORE");
  }

  let { children } = $props();

  window.addEventListener('online', () => {
      appState.update(s => ({
          ...s,
          online: true,
          hasSyncData: true
      }));
  });

  window.addEventListener('offline', () => {
      appState.update(s => ({
          ...s,
          online: false
      }));
  });

  appState.subscribe(async state => {
    if(
      !state.hasSyncData ||
      !state.user ||
      !state.online ||
      state.syncing
    ) {
      return;
    }

    syncToFirestore();
  });

  // import { onMount } from 'svelte';
  // import { auth } from '$lib/firebase';
  // import { onAuthStateChanged } from 'firebase/auth';

  // onMount(() => {
  //   onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       await fetch('/api/session', {
  //         method: 'POST',
  //         body: JSON.stringify({ uid: user.uid }),
  //         headers: { 'Content-Type': 'application/json' }
  //       });
  //     } else {
  //       await fetch('/api/session', { method: 'DELETE' });
  //     }
  //   });
  // });
</script>

<nav class="header-nav">
  <a class="header-nav-item" href="/">home</a>
  {#if !$appState.user}
    <a class="header-nav-item" href="/login">login</a>
  {:else}
    <a class="header-nav-item" href="/profile">profile</a>
  {/if}
</nav>

{#if $appState.loading}
  <section class="sync-bar indicator-bar">
    loading...
  </section>
{/if}

{#if $appState.syncing}
  <section class="load-bar indicator-bar">
    syncing...
  </section>
{/if}

{@render children()}

<style>
  .indicator-bar {
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
    background-color: burlywood;
    color: black;
    border: 1px solid black;
    padding: 2px 2px 2px 2px;
  }

  .header-nav {
    background-color: #88bb88;
    position: sticky;
    top: 0px;
    margin: 0px;
    padding: 0px;
    padding: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    /*
    justify-content: space-between;
    */
    gap: 3rem;
  }

  .header-nav-item {
    text-decoration: none;
    color: white;
    font-size: 30px;
    padding: 1rem;
    background-color: green;
    border-radius: 5px;
  }
</style>
