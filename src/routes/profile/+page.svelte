<script lang="ts">
    import { goto } from "$app/navigation";
    import { firestore } from "$lib/firebase";
    import { appState } from "$lib/state/app.svelte";
    import { collection, doc, getDocs } from "firebase/firestore";

    if (!$appState.user) {
        goto("/login");
    }

    let data = $state<any[]>([])

    async function testFirestore() {
        appState.update(state => ({
            ...state,
            loading: true
        }));
        console.log("TESTFIRESTORE")
        const snap = await getDocs(collection(firestore, "diary"));

        data = snap.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        console.log(`lodead ${data.length} data`)
        appState.update(state => ({
            ...state,
            loading: false
        }));
    }

    function forceFirestoreSync() {
        appState.update(state => ({
            ...state,
            hasSyncData: true
        }));
    }
</script>

<br />
<br />
<br />

<fieldset>
    <legend>{$appState.user?.displayName}</legend>

    <fieldset>
        <legend>user id</legend>
        {$appState.user?.uid}
    </fieldset>

    <fieldset>
        <legend>firebase tests</legend>
        <ul>
            <li>
                <button onclick={testFirestore}>test firestore</button>
            </li>
            <li>
                <button onclick={forceFirestoreSync}>sync firestore data</button>
            </li>
        </ul>
        <fieldset>
            <legend>data</legend>
            {#if data.length}
                <ul>
                {#each data as d}
                    <li>{d.id} // {d.activity} @ {d.date}H{d.time}</li>
                {/each}
                </ul>
            {:else}
                no data
            {/if}
        </fieldset>
    </fieldset>

</fieldset>

<style>
    fieldset{
        background: rgba(50, 50, 50, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid darkolivegreen;
    }

    button {
        font-size: 20px;
        font-weight: 600;
    }

    li {
        list-style-type: disc;
    }
</style>