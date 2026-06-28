<script lang="ts">
    import { firestore } from "$lib/firebase";
    import { STORENAME_SHARE } from "$lib/indexdb";
    import { appState } from "$lib/state/app.svelte";
    import { collection, getDocs, query, where } from "firebase/firestore";
    import { onMount } from "svelte";

    let pendingRequests = $state<any[]>([]);

    appState.update(state => ({
        ...state,
        loading: true
    }));

    onMount(async () => {
        try {

        const q = query(
            collection(firestore, STORENAME_SHARE),
            where("creatorId", "==", $appState.user!.uid),
            where("usedBy", "!=", null)
        );

        const snap = await getDocs(q);
        pendingRequests = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        }
        finally {

        appState.update(state => ({
            ...state,
            loading: false
        }));
        }

    });
</script>

{#if pendingRequests.length > 0}
<ul>

</ul>
    
{/if}