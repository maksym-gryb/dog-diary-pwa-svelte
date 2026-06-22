<script lang="ts">
    import { openDB, STORENAME_PETS } from "$lib/indexdb";
    import { onMount } from "svelte";

    type Props = {
        isCreate: boolean;
        petData?: PetData;
        reloadDataCallback?: Function;
    };

    let { isCreate, petData, reloadDataCallback }: Props = $props();

    let name = $state("");
    name = petData && petData?.name ? petData.name : "";

    let db: IDBDatabase;

    onMount(() => {
        const dbr = openDB();

        dbr.onsuccess = () => db = dbr.result;
        dbr.onerror = (e) => console.log(e);
    });

    function savePet() {
        if (!name) {
            console.error("missing data to save");
            console.log(name);
            return;
        }

        // if(petData && !petData.id) {
        //     petData.id = crypto.randomUUID();
        // }
        const tx = db.transaction(STORENAME_PETS, "readwrite");
        const store = tx.objectStore(STORENAME_PETS);

        const req = store.add({
            name: name,
        });

        req.onsuccess = () => reloadDataCallback?.();
        req.onerror = (e) => console.log(e);
    }
</script>

{#if isCreate}
    <fieldset>
        <legend>
            {isCreate ? "NEW PET" : name}
        </legend>

        <label>
            name:
            <input type="text" bind:value={name} />
        </label>

        <br />

        <button onclick={savePet}>save</button>
    </fieldset>
{/if}
