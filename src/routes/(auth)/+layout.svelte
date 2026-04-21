<script lang="ts">
	import Layout1 from '$components/layouts/Layout1.svelte';
	import CharacterFlowing from '$components/CharacterFlowing.svelte';
	import Particles from '$components/Particles.svelte';

	let { children } = $props();
</script>

<Particles className="fixed inset-0" />
<Layout1>
	<div class="flex items-end">
		<CharacterFlowing />
		<div class="flex w-fit flex-col items-center justify-center">
			{@render children()}
		</div>
		<CharacterFlowing />
	</div>
</Layout1>
