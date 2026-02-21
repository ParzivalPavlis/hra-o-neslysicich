<script lang="ts">
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import MainMenuHeading from '$components/typography/MainMenuHeading.svelte';
</script>

<div class="relative flex min-h-screen flex-col items-center gap-10 p-10">
	<MainMenuHeading>Hra o neslyšících</MainMenuHeading>
	<GameButton onclick={() => goto('/levels')} class="w-[80%] max-w-100">Úrovně</GameButton>
	<GameButton class="w-[80%] max-w-100">Profil</GameButton>
	<GameButton class="w-[80%] max-w-100">Titulky</GameButton>
</div>
