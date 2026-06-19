<script lang="ts">
    import { openDB } from "$lib/indexdb";

    type Props = {
        isCreate: bool;
        petData: PetData;
    };

    let {isCreate, petData} = $props();

    const db = openDB();

    function savePet(){
        //
    }
</script>

{#if isCreate}
<form onsubmit={(e) => {
    e.preventDefault();
    savePet();
}}>

<fieldset>
<legend>
    {#if isCreate}
    {/if}
    {#if !isCreate}
    {/if}
</legend>

<label>
    name:
    <!-- <input type="text" value="{petData?.name}"/> -->
</label>

</form>
</fieldset>
{#else}
stuff
{/if}