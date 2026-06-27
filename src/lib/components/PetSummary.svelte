<script lang="ts">
    import type { PetData } from "$lib/data/PetData";

    type Props = {
        data: PetData;
    };

    let { data }: Props = $props();

    function formatDate (d: Date) : string {
        return d.toISOString().slice(0, 10);
    }

    const todayStr :string = formatDate(new Date());
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
                <li>{m.name == null || m.name == "" ? m.id : m.name} => {m.type}</li>
            {/each}
        </ul>
        {/if}
    </div>
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
</style>
