<script lang="ts">
    import Loading from "$lib/components/Loading.svelte";
    import PetDetails from "$lib/components/PetDetails.svelte";
    import PetSummary from "$lib/components/PetSummary.svelte";
    import { openDB, STORENAME_PETS } from "$lib/indexdb";
    import { onMount } from "svelte";

    let loading = $state(true);
    let error = $state(false);
    let results = $state<any[]>([]);

    let db: IDBDatabase;

    onMount(() => {
        const request = openDB();

        request.onsuccess = () => {
            db = request.result;

            loadPetData();
        };
    });

    function loadPetData() {
        console.log("...loading all pets");
        const tx = db.transaction(STORENAME_PETS, "readonly");
        const store = tx.objectStore(STORENAME_PETS);

        const req = store.getAll();

        req.onsuccess = () => {
            console.log("LOADED: " + req.result.length + " pets");
            loading = false;
            results = req.result;
        };

        req.onerror = (ev) => {
            console.error("FAILED TO LOAD PETS");
            loading = false;
            error = true;
            console.log(ev);
        };
    }
</script>

{#if loading}
    <Loading />
{/if}

{#if error}
    <p style="color:red;">there was an error</p>
{/if}

<ul>
    {#each results as r}
        <PetSummary data={r} />
    {/each}
</ul>

<!-- if there are no results, means user/pet setup is requried -->
{#if results.length == 0}
    <PetDetails isCreate={true} reloadDataCallback={loadPetData} />
{/if}

<style>
  * {
    font-size: 24px;
  }
</style>
