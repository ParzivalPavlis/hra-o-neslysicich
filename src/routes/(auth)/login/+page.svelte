<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertMessage from '$components/AlertMessage.svelte';
	import FormInput from '$components/FormInput.svelte';
	import GameButton from '$components/GameButton.svelte';
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
	<title>Přihlášení | Deafio</title>
</svelte:head>

<Logo />
<div class="mt-6 flex w-full max-w-md flex-col gap-5">
	<!-- Google Sign In -->
	<form method="POST" action="?/google" use:enhance>
		<GameButton variant={4} type="submit" class="w-full" disabled={loading}>
			<img src="/icons/google.svg" alt="Google Logo" class="h-7 w-7" />
			Přihlásit se
		</GameButton>
	</form>
	<!-- Divider -->
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t border-gray-300"></div>
		</div>
		<div class="relative flex justify-center text-sm">
			<span class="bg-white px-2 text-gray-500">nebo</span>
		</div>
	</div>
	<!-- Email/Password Form -->
	<form
		class="flex w-full flex-col gap-5"
		method="POST"
		action="?/email"
		use:enhance={handleSubmit}
	>
		{#if form?.message !== undefined}
			<AlertMessage message={form.message} variant={form?.success ? 'success' : 'error'} />
		{/if}
		<FormInput
			id="email"
			name="email"
			label="E-mail"
			type="email"
			placeholder="jan.novak@gmail.com"
			value={form?.email ?? ''}
			error={form?.errors?.email}
			required
		/>
		<FormInput
			id="password"
			name="password"
			label="Heslo"
			type="password"
			placeholder="••••••••"
			error={form?.errors?.password}
			required
		/>
		<GameButton type="submit" class="w-full" disabled={loading}>Přihlásit se</GameButton>
		<div class="flex flex-col">
			<Paragraph className="text-center">
				<a
					href="/forgot-password"
					class="font-medium text-primary hover:text-secondary hover:underline"
				>
					Zapomněli jste heslo?
				</a>
			</Paragraph>
			<Paragraph className="text-center">
				Nemáte účet?
				<a href="/register" class="font-medium text-primary hover:text-secondary hover:underline">
					Registrovat se
				</a>
			</Paragraph>
		</div>
	</form>
</div>
