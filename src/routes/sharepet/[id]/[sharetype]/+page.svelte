<script lang="ts">
    import { page } from "$app/state";
    import type { SharePetData } from "$lib/data/SharePetData";
    import { sharePetType, type SharePetType } from "$lib/data/SharePetType";
    import { firestore } from "$lib/firebase";
    import { STORENAME_SHARE } from "$lib/indexdb";
    import { appState } from "$lib/state/app.svelte";
    import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
    import QRCode from "qrcode";
    import { onMount } from "svelte";

    type RouteParams = {
        id: string;
        sharetype: SharePetType;
    };

    let canvas : HTMLCanvasElement;

    const petId = $derived((page.params as RouteParams).id);
    const shareType = $derived((page.params as RouteParams).sharetype);

    const shareId = crypto.randomUUID();

    let url = $state("");

    $effect(() => {
        if (!canvas || $appState.loading || url == "") return;

        QRCode.toCanvas(canvas, url, {
            width: 256,
            margin: 2
        });
    });

    appState.update(state => ({
        ...state,
        loading: true
    }));

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const share :SharePetData = {
        id: crypto.randomUUID(),
        creatorId: $appState.user!.uid,
        petId: petId,
        role: shareType,
        expiresAt: expiresAt,
        maxUses: 1,
        used: 0
    }

    setDoc(doc(firestore, STORENAME_SHARE, shareId), share)
    .then(() => {
        url = `https://dog-diary-pwa.web.app/redeem/${shareId}`;
    })
    .finally(() => {
        appState.update(state => ({
            ...state,
            loading: false
        }));
    });
</script>

<div class="qr-container">
<canvas bind:this={canvas}></canvas>
</div>

<style>
    .qr-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>