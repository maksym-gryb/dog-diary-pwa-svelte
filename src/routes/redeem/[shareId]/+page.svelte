<script lang="ts">
    import { page } from "$app/state";
    import { firestore } from "$lib/firebase";
    import { STORENAME_SHARE } from "$lib/indexdb";
    import { appState } from "$lib/state/app.svelte";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { onMount } from "svelte";

    type RouteParams = {
        shareId: string;
    };

    const shareId = $derived((page.params as RouteParams).shareId);

    let error = $state("");

    appState.update((state) => ({
        ...state,
        loading: true,
    }));

    onMount(async () => {
        const ref = doc(firestore, STORENAME_SHARE, shareId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            let data = snap.data();
            data.usedBy = $appState.user!.uid;
            await setDoc(doc(firestore, STORENAME_SHARE, shareId), data);
        } else {
            error = "could not find ";
        }

        appState.update((state) => ({
            ...state,
            loading: false,
        }));
    });
</script>

{#if error.length > 0}
    <div class="error">
        {error}
    </div>
{/if}
{#if error === "" && !$appState.loading}
    <div class="success">Successfully added user to Pet</div>
{/if}

<style>
</style>
