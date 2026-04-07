<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertMessage from '$components/AlertMessage.svelte';
	import FormInput from '$components/FormInput.svelte';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import Logo from '$components/Logo.svelte';
	import Particles from '$components/Particles.svelte';
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
	<title>Zapomenuté heslo | Deafio</title>
</svelte:head>

<Particles className="fixed inset-0" />
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
