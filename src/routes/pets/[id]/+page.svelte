<script lang="ts">
    import { page } from "$app/state";
    import ActivityIcon from "$lib/components/ActivityIcon.svelte";
    import { activityTypes, createIcon } from "$lib/data/activityTypes";
    import { openDB, STORENAME_ACTIVITIES, STORENAME_PETS } from "$lib/indexdb";
    import { onMount } from "svelte";
    import { preventDefault } from "svelte/legacy";

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
        d.toLocaleTimeString('de-DE', {
            hour: "2-digit",
            minute: "2-digit"
        });


    const date = "2026-06-20";

    let loading = true;
    let error = false;

    let scrollTarget: HTMLElement | null = null;

    let db : IDBDatabase;
    onMount(async () => {
        // indexdbsetup
        db = await openDB();

        const tx = db.transaction(STORENAME_ACTIVITIES, "readonly");
        const store = tx.objectStore(STORENAME_ACTIVITIES);

        const req = store.getAll();

        req.onsuccess = () => {
            console.log("LOADED: " + req.result.length + " ACTIVITIES for pet " + petId)
            loading = false;
            activities = req.result ?? [];
        };

        req.onerror = (ev) => {
            console.error("FAILED TO LOAD ACTIVITIES")
            loading = false;
            error = true;
            console.log(ev);
        };

        // scroll to current time
        scrollToCurrentTimeslot();
    });

    function scrollToCurrentTimeslot() {
        scrollTarget = document.getElementById(nearestTimeslots[0].replace(":", "_"));
        scrollTarget?.scrollIntoView({ behavior: "smooth" });
    }

    function toggleActivity(date:string, time:string, act:string) {
        const existing = activities.filter(a => a.date == date && a.time == time && a.activity == act);
        if(existing.length > 0) {
            console.error("TODO: DELETE THIS ONE AND MARK IT AS DELETED FOR SYNC");
        } else {
            const tx = db.transaction(STORENAME_ACTIVITIES, "readwrite");
            const store = tx.objectStore(STORENAME_ACTIVITIES);

            const req = store.add({
                time: time,
                date: date,
                activity: act,
                petId: petId
            })

            req.onsuccess = (ev) => {
                const id = (ev.target as IDBRequest).result;
                activities = [...activities, {
                    id: id,
                    time: time,
                    date: date,
                    activity: act,
                    petId: petId
                }]

                console.log(`${date}@${time} // ${act}`)
            }

            req.onerror = (ev) => console.error("FAILED TO SAVe");
        }
    }

    function leftPad(r: string) {
        return r.length > 1 ? r : `0${r}`;
    }

    function isActive(date: string, time: string, act: string) {
        return activitySet.has(`${date}|${time}|${act}`);
    }

    function nearestTimeslotsToNow(): string[] {
        const now = new Date();

        if ([0, 30].includes(now.getMinutes())) {
            return [timeslotFormat(now)];
        }

        const start = new Date(now);
        start.setMinutes(now.getMinutes() < 30 ? 0 : 30, 0, 0);

        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 30);

        return [timeslotFormat(start), timeslotFormat(end)];
    }

    const nearestTimeslots = nearestTimeslotsToNow();
    console.log(nearestTimeslots);

    let openTimeslot: string = $state("");
    function toggleTimeslot(selectedTimeslot: string) {
        openTimeslot = openTimeslot === selectedTimeslot ? "" : selectedTimeslot;
    }

</script>

<style>
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
  background-color: rgb(218, 184, 121);
  color: black;
}


/* Optional styling for the revealed content */
.timeslot-activities{
  /* background-color: rgb(218, 184, 121); */
  padding: 10px;
  border-radius: 4px;
    gap: 15px;

}

.timeslot.current {
    background-color: rgb(33, 116, 116);
}

.timeslot.open .timeslot-activities {
    display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
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
    background-color: brown;
}
</style>

{#each Array.from({ length: 24*2 }, (_, i) => i) as i}
    { let minute = (i % 2 * 30).toString(); }
    { let hour = Math.floor(i / 2).toString(); }
    { let timeslot = `${leftPad(hour.toString())}:${leftPad(minute.toString())}`; }
    <!-- TODO -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div id={timeslot.replace(":", "_")}
     class={[
        "timeslot",
        nearestTimeslots.includes(timeslot) && "current",
        openTimeslot === timeslot && "open"
        ]}
        onclick={() => toggleTimeslot(timeslot)}>
        <span class="timeslot-time">{timeslot}</span>
        <span class="timeslot-activities">
            {#each activityTypes as act}
                <span class={[
                    "activity-container",
                    isActive(date, timeslot, act) && 'active'
                    ]}>
                    <button onclick={(e) => {
                        e.stopPropagation();
                        toggleActivity(date, timeslot, act);
                        }}>
                        <ActivityIcon activityType={act} />
                    </button>
                </span>
            {/each}
        </span>
    </div>
    <!-- <div class="horizontal-wrapper">
    <details>
        <summary>{timeslot}</summary>
        <div class="details-content">

            {#each activityTypes as act}
            <span style="padding: 0px 20px 0px 8px; width:800px;">
                <button onclick={() => toggleActivity(date, timeslot, act)}>
                    <ActivityIcon activityType={act} />
                </button>
            </span>
            {/each}
        </div>
    </details>
    </div> -->
{/each}