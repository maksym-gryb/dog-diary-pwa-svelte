<!-- <script lang="ts">
	import { onMount } from "svelte";
	// import { auth, db } from "$lib/firebase.ts.old";
	import { onAuthStateChanged } from "firebase/auth";
	import {
		collection,
		query,
		where,
		orderBy,
		getDocs,
	} from "firebase/firestore";
	import { activityTypes, createIcon } from "$lib/data/activityTypes";
	import ActivityIcon from "$lib/components/ActivityIcon.svelte";

	function leftPad(n: number) {
		const s = n.toString();
		return s.length > 1 ? s : `0${s}`;
	}

	let activities = $state<Record<string, string[]>>({});
	let loading = $state(true);
	let error = $state("");

	let selectedTimeslot = $state("");

	const timeslots = Array.from({ length: 24 * 2 }, (_, n) => n).map(
		(n) => `${leftPad(Math.floor(n / 2))}:${leftPad((n % 2) * 30)}`,
	);

	async function loadActivities(uid: string) {
		const today = new Date().toISOString().slice(0, 10);

		const q = query(
			collection(db, "diary"),
			// where('creatorId', '==', uid),
			where("date", "==", today),
			// orderBy('time', 'asc')
		);

		const snapshot = await getDocs(q);

		for (const doc of snapshot.docs) {
			const data = doc.data();
			const timeslot = data.time;

			if (!activities[timeslot]) {
				activities[timeslot] = [];
			}

			activities[timeslot].push(data.activity);
		}

		// activities = snapshot.docs.map((doc) => ({
		// 	id: doc.id,
		// 	...doc.data()
		// }));
	}

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			try {
				if (!user) {
					error = "Not logged in";
					// activities = [];
					return;
				}

				error = "";
				await loadActivities(user.uid);
			} catch (e) {
				console.error(e);
				error = "Failed to load activities";
			} finally {
				loading = false;
			}
		});

		return unsubscribe;
	});
</script>

<h1>Today's Activities</h1>

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>{error}</p>
{:else}
	<ul>
		{#each timeslots as timeslot}
			<li id={timeslot}>
				<button
					onclick={() => {
						selectedTimeslot = selectedTimeslot === timeslot ? "" : timeslot;
					}
				}
				>
					<strong>{timeslot}</strong>
				</button>
				{#if selectedTimeslot == timeslot}
					{#each activityTypes as a}
						<ActivityIcon activityType={a} />
					{/each}
				{/if}
				{#each activities[timeslot] as a}
					<ActivityIcon activityType={a} />
				{/each}
			</li>
		{/each}
	</ul>
{/if} -->
