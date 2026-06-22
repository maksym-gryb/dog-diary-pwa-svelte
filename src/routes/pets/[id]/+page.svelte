<script lang="ts">
    import { page } from "$app/state";
    import ActivityIcon from "$lib/components/ActivityIcon.svelte";
    import { activityTypes } from "$lib/data/activityTypes";
    import { openDB, STORENAME_ACTIVITIES } from "$lib/indexdb";
    import { onMount } from "svelte";

    const petId = page.params.id;

    let activities = $state<any[]>([]);

    let activitySet = $derived.by(() => {
        const set = new Set<string>();

        for (const a of activities) {
            set.add(`${a.date}|${a.time}|${a.activity}`);
        }

        return set;
    });

    const timeslotFormat = (d: Date) =>
        d.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });

    const date = "2026-06-20";

    let loading = true;
    let error = false;

    let scrollTarget: HTMLElement | null = null;

    let db: IDBDatabase;
    onMount(() => {
        // indexdbsetup

        let request = openDB();

        request.onsuccess = () => {
            db = request.result;
            loadData();
        };

        request.onerror = (ev: any) => console.error(ev);

        // calculate current timeslots
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                refreshTimeslots();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        // scroll to current timeslots
        scrollToCurrentTimeslot();

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    });

    function loadData() {
        const tx = db.transaction(STORENAME_ACTIVITIES, "readonly");
        const store = tx.objectStore(STORENAME_ACTIVITIES);

        const req = store.getAll();

        req.onsuccess = () => {
            console.log(
                "LOADED: " + req.result.length + " ACTIVITIES for pet " + petId,
            );
            activities = req.result?.filter((x) => !x.isDeleted) ?? [];
            const deletedNum = req.result?.filter((x) => x.isDeleted).length;
            console.log(`DELETE ITEMS IN STORE: ${deletedNum}`);
            loading = false;
        };

        req.onerror = (ev) => {
            console.error("FAILED TO LOAD ACTIVITIES");
            loading = false;
            error = true;
            console.log(ev);
        };
    }

    function refreshTimeslots() {
        now = new Date();
    }

    function scrollToCurrentTimeslot() {
        scrollTarget = document.getElementById(
            nearestTimeslots[0].replace(":", "_"),
        );
        scrollTarget?.scrollIntoView({ behavior: "smooth" });
    }

    function toggleActivity(date: string, time: string, act: string) {
        const existing = activities.filter(
            (a) =>
                a.date == date &&
                a.time == time &&
                a.activity == act &&
                (!a.isDeleted || a.isDeleted === false),
        );
        if (existing.length > 0) {
            const tx = db.transaction(STORENAME_ACTIVITIES, "readwrite");
            const store = tx.objectStore(STORENAME_ACTIVITIES);

            for (const activity of existing) {
                console.log(activity);
                store.put({
                    id: activity.id,
                    time: activity.time,
                    date: activity.date,
                    activity: activity.activity,
                    petId: petId,
                    isDeleted: true,
                });
            }

            tx.oncomplete = () => {
                console.log(`All updates complete (${existing.length})`);
                loadData();
            };

            tx.onerror = () => {
                console.error("Update failed");
            };
        } else {
            const tx = db.transaction(STORENAME_ACTIVITIES, "readwrite");
            const store = tx.objectStore(STORENAME_ACTIVITIES);

            const req = store.add({
                time: time,
                date: date,
                activity: act,
                petId: petId,
            });

            req.onsuccess = (ev) => {
                const id = (ev.target as IDBRequest).result;
                activities = [
                    ...activities,
                    {
                        id: id,
                        time: time,
                        date: date,
                        activity: act,
                        petId: petId,
                    },
                ];

                console.log(`Added: ${date}@${time} // ${act}`);
            };

            req.onerror = (ev) => console.error("FAILED TO SAVE: " + ev);
        }
    }

    function leftPad(r: string) {
        return r.length > 1 ? r : `0${r}`;
    }

    function isActive(date: string, time: string, act: string) {
        return activitySet.has(`${date}|${time}|${act}`);
    }

    let now = $state(new Date());

    function nearestTimeslotsTo(now: Date): string[] {
        if ([0, 30].includes(now.getMinutes())) {
            return [timeslotFormat(now)];
        }

        const start = new Date(now);
        start.setMinutes(now.getMinutes() < 30 ? 0 : 30, 0, 0);

        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 30);

        return [timeslotFormat(start), timeslotFormat(end)];
    }

    let nearestTimeslots = $derived.by(() => nearestTimeslotsTo(now));

    let openTimeslot: string = $state("");
    function toggleTimeslot(selectedTimeslot: string) {
        openTimeslot =
            openTimeslot === selectedTimeslot ? "" : selectedTimeslot;
    }

    const timeslots = Array.from({ length: 48 }, (_, i) => {
        const minute = ((i % 2) * 30).toString();
        const hour = Math.floor(i / 2).toString();

        return `${leftPad(hour)}:${leftPad(minute)}`;
    });
</script>

<h1>
    {date}
</h1>

{#each timeslots as timeslot}
    <!-- TODO -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        id={timeslot.replace(":", "_")}
        class={[
            "timeslot",
            nearestTimeslots.includes(timeslot) && "current",
            openTimeslot === timeslot && "open",
        ]}
        onclick={() => toggleTimeslot(timeslot)}
    >
        <span class="timeslot-time">{timeslot}</span>
        <span class="timeslot-activities">
            {#each activityTypes as act}
                <span
                    class={[
                        "activity-container",
                        isActive(date, timeslot, act) && "active",
                    ]}
                >
                    {#if openTimeslot === timeslot}
                        <button
                            onclick={(e) => {
                                e.stopPropagation();
                                toggleActivity(date, timeslot, act);
                            }}
                        >
                            <ActivityIcon activityType={act} />
                        </button>
                    {:else}
                        <ActivityIcon activityType={act} />
                    {/if}
                </span>
            {/each}
        </span>
    </div>
{/each}

<style>
    h1 {
        text-align: center;
    }

    .timeslot-time {
        padding: 0.5rem;
        width: 100%;
        padding: 1rem;
        cursor: pointer;
        box-sizing: border-box;
        width: 100%;
        cursor: pointer;
        white-space: nowrap;
        font-size: 20px;
        font-weight: 400;
    }

    .timeslot.open .timeslot-time {
        width: auto;
    }

    .timeslot {
        display: grid;
        grid-template-columns: 1fr 11fr;
        width: 100%;
        border-top: 2px solid black;
    }

    .timeslot:hover {
        background-color: #334433;
        cursor: pointer;
    }

    .timeslot.open {
        background-color: rgb(181, 117, 15);
    }

    /* Optional styling for the revealed content */
    .timeslot-activities {
        /* background-color: rgb(218, 184, 121); */
        display: flex;
        border-radius: 4px;

        display: flex;
        justify-content: flex-start;
        gap: 1rem;
        padding: 0.5rem;
    }

    .timeslot.current {
        background-color: rgb(33, 116, 116);
    }

    .timeslot .activity-container {
        display: none;
    }

    .timeslot .activity-container.active {
        display: inline-block;
    }

    .timeslot .activity-container.active,
    .timeslot.open .activity-container {
        display: inline-block;
    }

    .activity-container.active > button {
        color: rgb(204, 255, 204);
        background-color: rgb(0, 0, 0, 0);
    }

    button {
        border: none;
        background-color: none;
        background-color: rgb(0, 0, 0, 0);
    }
</style>
