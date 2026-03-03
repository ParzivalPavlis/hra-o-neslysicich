<script lang="ts">
	import { enhance } from '$app/forms';
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
</script>

<svelte:head>
	<title>Přihlášení</title>
</svelte:head>

<Layout1>
	<form class="flex w-full max-w-md flex-col gap-5" method="POST" use:enhance={handleSubmit}>
		<MainMenuHeading>Hra o neslyšících</MainMenuHeading>
		{#if form?.message !== undefined}
			<div
				class={`mb-6 rounded-md p-4 text-sm ${
					form?.success
						? 'border border-green-200 bg-green-50 text-green-800'
						: 'border border-red-200 bg-red-50 text-red-800'
				}`}
			>
				{form?.message}
			</div>
		{/if}
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
		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">Heslo</label>
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
		<GameButton type="submit" class="w-full">Přihlásit se</GameButton>
		<Paragraph className="text-center">
			Nemáte účet?
			<a href="/register" class="font-medium text-blue-600 hover:text-blue-700 hover:underline">
				Registrovat se
			</a>
		</Paragraph>
	</form>
</Layout1>
