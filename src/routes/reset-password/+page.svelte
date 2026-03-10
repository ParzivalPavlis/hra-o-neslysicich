<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import AlertMessage from '$components/AlertMessage.svelte';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import MainMenuHeading from '$components/typography/MainMenuHeading.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import type { ActionData, SubmitFunction } from './$types';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};

	$effect(() => {
		if (form?.success) {
			setTimeout(() => {
				goto('/login');
			}, 2000);
		}
	});
</script>

<svelte:head>
	<title>Nastavit nové heslo</title>
</svelte:head>

<Layout1>
	<form class="flex w-full max-w-md flex-col gap-5" method="POST" use:enhance={handleSubmit}>
		<MainMenuHeading>Nastavit nové heslo</MainMenuHeading>
		{#if form?.message !== undefined}
			<AlertMessage message={form.message} variant={form?.success ? 'success' : 'error'} />
		{/if}
		{#if !form?.success}
			<Paragraph className="text-gray-600 text-center">Zadejte nové heslo pro váš účet.</Paragraph>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Nové heslo</label>
				<input
					id="password"
					name="password"
					class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					type="password"
					placeholder="••••••••"
					required
				/>
				{#if form?.errors?.password}
					<span class="mt-1 flex items-center text-sm text-red-600">
						{form?.errors?.password}
					</span>
				{/if}
			</div>
			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
					Potvrzení hesla
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					type="password"
					placeholder="••••••••"
					required
				/>
				{#if form?.errors?.confirmPassword}
					<span class="mt-1 flex items-center text-sm text-red-600">
						{form?.errors?.confirmPassword}
					</span>
				{/if}
			</div>
			<GameButton type="submit" class="w-full" disabled={loading}>Nastavit nové heslo</GameButton>
		{:else}
			<Paragraph className="text-center">
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-700 hover:underline">
					Přihlaste se
				</a>
			</Paragraph>
		{/if}
	</form>
</Layout1>
