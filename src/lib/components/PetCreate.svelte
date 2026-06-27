<script lang="ts">
    import type { PetData } from "$lib/data/PetData";
    import { SyncStatus } from "$lib/data/SyncData";
    import { openDB, STORENAME_PETS } from "$lib/indexdb";
    import { onMount } from "svelte";

    type Props = {
        reloadDataCallback: Function;
    };

    let { reloadDataCallback }: Props = $props();

    let pet: PetData = {
        id: crypto.randomUUID(),
        name: '',
        members: [],
        syncStatus: SyncStatus.pending,
        timestamp: Date.now(),
        isDeleted: false
    };

    let db: IDBDatabase;

    onMount(() => {
        const dbr = openDB();

        dbr.onsuccess = () => db = dbr.result;
        dbr.onerror = (e) => console.log(e);
    });

    function savePet() {
        if (!pet.name) {
            console.error("missing data to save");
            console.log(pet.name);
            return;
        }

        // if(petData && !petData.id) {
        //     petData.id = crypto.randomUUID();
        // }
        const tx = db.transaction(STORENAME_PETS, "readwrite");
        const store = tx.objectStore(STORENAME_PETS);

        const req = store.add(pet);

        req.onsuccess = () => reloadDataCallback?.();
        req.onerror = (e) => console.log(e);
    }
</script>

<fieldset>
    <legend>
        New Pet
    </legend>

    <label>
        name:
        <input type="text" bind:value={pet.name} />
    </label>

    <br />

    <button onclick={savePet}>save</button>
</fieldset>