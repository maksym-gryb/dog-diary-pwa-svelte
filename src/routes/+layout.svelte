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

    let pending = 2;
    function done () {
      pending--;

      if (pending === 0) {

    // end sync
    console.log("sync end");
    appState.update((state) => ({
      ...state,
      syncing: false,
      hasSyncData: false,
    }));

      }
    }

    console.log("starting sync");

    { 
      // populate owners
      const dbr = openDB();
      dbr.onerror = (err) => console.error(err);
      dbr.onsuccess = () => {
        const idb = dbr.result;
        const s = STORENAME_PETS;
        const store = idb.transaction(s, "readwrite").objectStore(s);
        const req = store.getAll();
        req.onerror = (err) => {
          console.error(err);
          done();
        }
        req.onsuccess = () => {
          const pets = req.result;
          for (let i = 0; i < pets.length; i++) {
            if(pets[i].owners.length === 0) {
              pets[i].owners = [$appState.user?.uid]
              store.put(pets[i]);
            }
          }

          syncFirestoreStore(STORENAME_PETS, done);
        }
      }
    }

    syncFirestoreStore(STORENAME_ACTIVITIES, done);
  }

  function syncFirestoreStore(storename: string, done: Function) {
    console.log("[+] SYNCINNG ", storename);
    appState.update((state) => ({
      ...state,
      syncing: true,
    }));

    try {
      const dbr = openDB();

      dbr.onsuccess = () => {
        const idb = dbr.result;
        const tx = idb.transaction(storename, "readwrite");
        const store = tx.objectStore(storename);

        const req = store.getAll();
        req.onsuccess = async () => {
          console.log("[+] Comparing stores")
          const localMap = new Map(req.result.map((x) => [x.id, x]));
          const snap = await getDocs(
            collection(firestore, storename),
          );
          const remoteMap = new Map(snap.docs.map((d) => [d.id, d.data()]));

          const allKeys = new Set([...localMap.keys(), ...remoteMap.keys()]);

          const download : any[] = [];
          const upload: any[] = [];

          for (const id of allKeys) {
            const local = localMap.get(id);
            const remote = remoteMap.get(id);

            if (!local) {
              download.push(remote);
            } else if (!remote) {
              upload.push(local);
            } else if (local.timestamp > remote.timestamp) {
              upload.push(local);
            } else if (remote.timestamp > local.timestamp) {
              download.push(remote);
            }
          }

          console.log("DOWNLOADS: ", download.length)
          console.log("UPLOADS: ", upload.length)

          console.log("[-] Stores compare completed")

          console.log("[+] batching firestore")
          const batch = writeBatch(firestore);

          for (const r of upload) {
            const ref = doc(firestore, storename, r.id);
            batch.set(ref, r);
          }

          await batch.commit();
          console.log("[-] sent to firestore")

          console.log("[+] updating local indexdb")
          for (const r of download) {
            store.put(r)
          }
          console.log("[-] local indexdb update complete")
          done();
        };

        req.onerror = (ev) => {
          console.error("FAILED TO LOAD ACTIVITIES", ev);
          done();
        };
      };
      dbr.onerror = (e) => {
        console.log(e);
        done();
      }
    } catch {
      // intentionally empty
    }
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
