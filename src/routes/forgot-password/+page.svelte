<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertMessage from '$components/AlertMessage.svelte';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import Logo from '$components/Logo.svelte';
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
</script>

<svelte:head>
	<title>Obnova hesla</title>
</svelte:head>

<Layout1>
	<Logo class="mb-5" />
	<form class="flex w-full max-w-md flex-col gap-5" method="POST" use:enhance={handleSubmit}>
		{#if form?.message !== undefined}
			<AlertMessage message={form.message} variant={form?.success ? 'success' : 'error'} />
		{/if}
		{#if !form?.success}
			<Paragraph className="text-gray-600 text-center">
				Zadejte svou e-mailovou adresu a zašleme vám odkaz na obnovu hesla.
			</Paragraph>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
				<input
					id="email"
					name="email"
					class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					type="email"
					placeholder="jan.novak@gmail.com"
					value={form?.email ?? ''}
					required
				/>
				{#if form?.errors?.email}
					<span class="mt-1 flex items-center text-sm text-red-600">
						{form?.errors?.email}
					</span>
				{/if}
			</div>
			<GameButton type="submit" class="w-full" disabled={loading}>
				Odeslat odkaz na obnovu
			</GameButton>
		{/if}
		<Paragraph className="text-center">
			Pamatujete si heslo?
			<a href="/login" class="font-medium text-blue-600 hover:text-blue-700 hover:underline">
				Zpět na přihlášení
			</a>
		</Paragraph>
	</form>
</Layout1>
