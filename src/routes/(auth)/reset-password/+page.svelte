<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import AlertMessage from '$components/AlertMessage.svelte';
	import FormInput from '$components/FormInput.svelte';
	import GameButton from '$components/GameButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import type { ActionData, SubmitFunction, PageData } from './$types';
	import Logo from '$components/Logo.svelte';

	let { form, data }: { form: ActionData; data: PageData } = $props();

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
	<title>Nastavit nové heslo | Deafio</title>
</svelte:head>

<Logo />
<form class="mt-6 flex w-full max-w-md flex-col gap-5" method="POST" use:enhance={handleSubmit}>
	<input type="hidden" name="code" value={data.code} />
	{#if form?.message !== undefined}
		<AlertMessage message={form.message} variant={form?.success ? 'success' : 'error'} />
	{/if}
	{#if !form?.success}
		<Paragraph className="text-gray-600 text-center">Zadejte nové heslo pro váš účet.</Paragraph>
		<FormInput
			id="password"
			name="password"
			label="Nové heslo"
			type="password"
			placeholder="••••••••"
			error={form?.errors?.password}
			required
		/>
		<FormInput
			id="confirmPassword"
			name="confirmPassword"
			label="Potvrzení hesla"
			type="password"
			placeholder="••••••••"
			error={form?.errors?.confirmPassword}
			required
		/>
		<GameButton type="submit" class="w-full" disabled={loading}>Nastavit nové heslo</GameButton>
	{:else}
		<Paragraph className="text-center">
			<a href="/login" class="font-medium text-primary hover:text-secondary hover:underline">
				Přihlaste se
			</a>
		</Paragraph>
	{/if}
</form>
