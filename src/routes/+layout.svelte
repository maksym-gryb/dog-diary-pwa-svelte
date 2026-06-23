<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { appState } from "$lib/state/app.svelte";
  // import { onMount } from 'svelte';

  // onMount(async () => {
  //   if ('serviceWorker' in navigator) {
  //     await navigator.serviceWorker.register('/service-worker.js');
  //   } else {
  //     alert("NO SERVICE WORKER AVAILABLE");
  //   }
  // });

  let { children } = $props();

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

<!-- <slot /> -->

<!-- <svelte:head> -->
<!-- <link rel="manifest" href="/manifest.json" />
	<link rel="icon" href={favicon} /> -->
<!-- </svelte:head> -->

{#if appState.loading}
  <section class="sync-bar indicator-bar">
    loading...
  </section>
{/if}

{#if appState.syncing}
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
</style>
