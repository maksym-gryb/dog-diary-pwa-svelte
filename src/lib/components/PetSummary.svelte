<script lang="ts">
    type Props = {
        data: PetData;
    };

    let { data }: Props = $props();
</script>

<fieldset>
    <legend><a href="/pets/{data.id}"> {data.name}</a> </legend>
    <div>
        owners :
        {#if data.owners?.length ?? 0 === 0}
        NONE
        {/if}
        {#each data.owners as o}
            {o}
        {/each}
    </div>
    <div>
        caretakers: 
        {#if data.caretakers?.length ?? 0 === 0}
        NONE
        {/if}
        {#each data.caretakers as o}
            {o}
        {/each}
    </div>
</fieldset>
