<script lang="ts">
	import { goto } from '$app/navigation';
	import CharacterFlowing from '$components/CharacterFlowing.svelte';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import Logo from '$components/Logo.svelte';
	import Particles from '$components/Particles.svelte';
	import { clearAllStores } from '$lib/stores/gameState';

	const handleLogout = async () => {
		const res = await fetch('/api/v1/auth/logout', { method: 'POST' });
		if (res.ok) {
			clearAllStores();
			goto('/login');
		}
	};
</script>

<svelte:head>
	<title>Deafio</title>
</svelte:head>

<Particles className="fixed inset-0" />
<Layout1>
	<div class="flex items-end">
		<CharacterFlowing />
		<div class="relative flex w-fit flex-col items-center justify-center gap-10 p-10">
			<Logo />
			<GameButton onclick={() => goto('/levels')} class="w-full max-w-100">Úrovně</GameButton>
			<GameButton onclick={() => goto('/profile')} class="w-full max-w-100">Profil</GameButton>
			<GameButton onclick={handleLogout} variant={3} class="w-full max-w-100">
				Odhlásit se
			</GameButton>
		</div>
		<CharacterFlowing />
	</div>
</Layout1>
