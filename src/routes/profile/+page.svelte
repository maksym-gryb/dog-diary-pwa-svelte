<script lang="ts">
    import { goto } from "$app/navigation";
    import { appState } from "$lib/state/app.svelte";

    if (!$appState.user) {
        goto("/login")
    }
</script>

<fieldset>
    <legend>{$appState.user?.displayName}</legend>
    <div>
        <label>user uid</label>
        {$appState.user?.uid}
    </div>
</fieldset>
