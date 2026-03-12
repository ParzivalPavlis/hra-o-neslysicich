<script lang="ts">
	import { enhance } from '$app/forms';
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
	<title>Vytvořit účet</title>
</svelte:head>

<Layout1>
	<Logo class="mb-5" />
	<form class="flex w-full max-w-md flex-col gap-5" method="POST" use:enhance={handleSubmit}>
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
		<!-- Email -->
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
		<!-- Password -->
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
		<!-- Confirm Password -->
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
		<!-- Submit Button -->
		<GameButton type="submit" class="w-full">Registrovat se</GameButton>
		<!-- Link to Sign In -->
		<Paragraph className="text-center">
			Již máte účet?
			<a href="/login" class="font-medium text-blue-600 hover:text-blue-700 hover:underline">
				Přihlásit se
			</a>
		</Paragraph>
	</form>
</Layout1>
