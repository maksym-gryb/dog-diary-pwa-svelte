<script lang="ts">
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
