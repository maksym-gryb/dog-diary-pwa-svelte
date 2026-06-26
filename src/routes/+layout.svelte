<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { firestore } from "$lib/firebase";
  import { openDB, STORENAME_ACTIVITIES, STORENAME_PETS } from "$lib/indexdb";
  import { appState } from "$lib/state/app.svelte";
  import "$lib/store/auth"; // required for hooking onAuthStateChange(...)
  import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
  // import { onMount } from 'svelte';

  // onMount(async () => {
  //   if ('serviceWorker' in navigator) {
  //     await navigator.serviceWorker.register('/service-worker.js');
  //   } else {
  //     alert("NO SERVICE WORKER AVAILABLE");
  //   }
  // });

  async function syncFirestore() {
    if ($appState.syncing) {
      return;
    }

    console.log("starting sync");


    appState.update((state) => ({
      ...state,
      syncing: true,
    }));

    try {
      const dbr = openDB();

      dbr.onsuccess = () => {
        const idb = dbr.result;
        const tx = idb.transaction(STORENAME_ACTIVITIES, "readwrite");
        const store = tx.objectStore(STORENAME_ACTIVITIES);

        const req = store.getAll();
        req.onsuccess = async () => {
          const activitiesLocal = req.result ?? [];
          const snap = await getDocs(collection(firestore, STORENAME_ACTIVITIES))
          const activitiesRemote = snap.docs.map(d => ({
            id: d.id,
            ...d.date()
          }));

          // COMPARE SYNC DATA and evaluate which way a document needs to go


          const batch = writeBatch(firestore);

          for (const activity of activities) {
            const ref = doc(firestore, STORENAME_ACTIVITIES, activity.id);
            batch.set(ref, activity);
          }

          // TODO: later
          // await batch.commit();
        };

        req.onerror = (ev) => {
          console.error("FAILED TO LOAD ACTIVITIES", ev);
        };
      };
      dbr.onerror = (e) => console.log(e);
    } catch {
      // intentionally empty
    }

    // end sync
    console.log("sync end");
    appState.update((state) => ({
      ...state,
      syncing: false,
      hasSyncData: false,
    }));
  }

  let { children } = $props();

  window.addEventListener("online", () => {
    console.warn("ONLINE");
    appState.update((s) => ({
      ...s,
      online: true,
      hasSyncData: true,
    }));
  });

  window.addEventListener("offline", () => {
    console.warn("OFFLINE");
    appState.update((s) => ({
      ...s,
      online: false,
    }));
  });

  appState.subscribe(async (state) => {
    if (!state.hasSyncData || !state.user || !state.online || state.syncing) {
      return;
    }

    await syncFirestore();
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
  <section class="sync-bar indicator-bar">loading...</section>
{/if}

{#if $appState.syncing}
  <section class="load-bar indicator-bar">syncing...</section>
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
