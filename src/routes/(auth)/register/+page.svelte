<script lang="ts">
	import { enhance } from '$app/forms';
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
	<title>Registrovat se | Deafio</title>
</svelte:head>

<Logo />
<div class="mt-6 flex w-full max-w-md flex-col gap-5">
	<!-- Google Sign Up -->
	<form method="POST" action="?/google" use:enhance>
		<GameButton variant={4} type="submit" class="w-full" disabled={loading}>
			<img src="/icons/google.svg" alt="Google Logo" class="h-7 w-7" />
			Registrovat se
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
		<!-- Password -->
		<FormInput
			id="password"
			name="password"
			label="Heslo"
			type="password"
			placeholder="••••••••"
			error={form?.errors?.password}
			required
		/>
		<!-- Confirm Password -->
		<FormInput
			id="confirmPassword"
			name="confirmPassword"
			label="Potvrzení hesla"
			type="password"
			placeholder="••••••••"
			error={form?.errors?.confirmPassword}
			required
		/>
		<!-- Submit Button -->
		<GameButton type="submit" class="w-full" disabled={loading}>Registrovat se</GameButton>
		<!-- Link to Sign In -->
		<Paragraph className="text-center">
			Již máte účet?
			<a href="/login" class="font-medium text-primary hover:text-secondary hover:underline">
				Přihlásit se
			</a>
		</Paragraph>
	</form>
</div>
