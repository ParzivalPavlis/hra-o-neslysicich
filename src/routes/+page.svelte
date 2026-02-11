<script lang="ts">
	import { goto } from '$app/navigation';
	import MainMenuHeading from '$components/typography/MainMenuHeading.svelte';
	import Button from '$components/ui/button/button.svelte';
</script>

<div class="relative flex min-h-screen flex-col items-center gap-10 p-10">
	<MainMenuHeading>Hra o neslyšících</MainMenuHeading>
	<Button class="h-12 w-[80%] max-w-100 cursor-pointer text-2xl" onclick={() => goto('/levels')}>
		Úrovně
	</Button>
	<Button class="h-12 w-[80%] max-w-100 cursor-pointer text-2xl">Profil</Button>
	<Button class="h-12 w-[80%] max-w-100 cursor-pointer text-2xl">Titulky</Button>
</div>
