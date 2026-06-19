<script lang="ts">
	export const activityTypes = [
		'pee',
		'poop',
		'toothbrush',
		'bath'
	] as const;

	const LegacyActivityMap = {
		peeing: 'pee',
		pooping: 'poop'
	} as const;

	const ActivityIconMap = {
		pee: 'fa-toilet',
		poop: 'fa-poo',
		walk: 'fa-person-walking',
		eat: 'fa-bone',
		drink: 'fa-mug-hot',
		sleep: 'fa-bed',
		toothbrush: 'fa-tooth',
		bath: 'fa-bath'
	} as const;

	let { activityType } = $props<{
		activityType: string;
	}>();

	let iconClass = $derived.by(() => {
		let t = activityType;

		if (t in LegacyActivityMap) {
			t = LegacyActivityMap[t as keyof typeof LegacyActivityMap];
		}

		return (
			ActivityIconMap[t as keyof typeof ActivityIconMap] ??
			'fa-question'
		);
	});
</script>

<i class="fa-solid {iconClass}"></i>