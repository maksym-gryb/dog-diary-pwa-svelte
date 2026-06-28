<script lang="ts">
    import type { PetData } from "$lib/data/PetData";
    import { appState } from "$lib/state/app.svelte";

    type Props = {
        data: PetData;
    };

    let { data }: Props = $props();

    function formatDate(d: Date): string {
        return d.toISOString().slice(0, 10);
    }

    const todayStr: string = formatDate(new Date());
</script>

<fieldset>
    <legend><a href="/pets/{data.id}/{todayStr}"> {data.name}</a> </legend>
    <div>
        Members:
        {#if data.members.length === 0}
            NONE
        {:else}
            <ul>
                {#each data.members as m}
                    <li>
                        {m.name == null || m.name == "" ? m.id : m.name} => {m.type}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    {#if $appState.user && $appState.online}
        <div>
            <a class="button-href" href="/sharepet/{data.id}/owner">ADD OWNER</a>
        </div>
        <div>
            <a class="button-href" href="/sharepet/{data.id}/caretaker"
                >ADD CARETAKER</a
            >
        </div>
    {/if}
</fieldset>

<style>
    legend {
        font-size: 40px;
        padding: 0px;
        margin: 0px;
        border-radius: 5px;
    }

    legend:hover {
        background-color: darkgreen;
        box-shadow: 12px 5px 5px black;
    }

    a {
        text-decoration: none;
        color: blue;
        padding: 3px;
    }

    .button-href {
        display: inline-block;
        padding: 10px 16px;
        background-color: #2563eb;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        transition:
            background-color 0.15s ease,
            transform 0.05s ease;
        user-select: none;
        margin: 0.5rem;
    }

    .button-href:hover {
        background-color: #1d4ed8;
    }

    .button-href:active {
        transform: translateY(1px);
    }

    .button-href:focus-visible {
        outline: 2px solid #93c5fd;
        outline-offset: 2px;
    }
</style>
