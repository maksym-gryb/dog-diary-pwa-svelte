<script>
    import Loading from "$lib/components/Loading.svelte";
    import PetDetails from "$lib/components/PetDetails.svelte";
    import { openDB, STORE_NAME } from "$lib/indexdb";
    import { onMount } from "svelte";

    let loading = $state(true);
    let error = $state(false);
    let results = $state([]);

    onMount(async () => {
        const db = await openDB();

        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);

        const req = store.getAll();

        req.onsuccess = () => {
            loading = false;
            results = req.result;
        };

        req.onerror = (ev) => {
            loading = false;
            error = true;
            console.log(ev);
        };
    });
</script>

{#if loading}
    <Loading />
{/if}

{#if error}
    <p style="color:red;">there was an error</p>
{/if}

<ul>
    {#each results as r}
        <li>{r.id}</li>
    {/each}
</ul>

<!-- if there are no results, means user/pet setup is requried -->
{#if results.length == 0}
    <PetDetails newPet=true />
{/if}
