<script lang="ts">
	import { cn } from '$lib/utils';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import Heading from '$components/typography/Heading.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Particles from '$components/Particles.svelte';
	import GameButton from '$components/GameButton.svelte';
	import { Star, Mail, Calendar, ChevronDown } from '@lucide/svelte';
	import { slide, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import { colors } from '$lib/client/shared/colors';

	let { data }: { data: PageData } = $props();

	let isOpen = $state(false);
	const user = $derived(data.user);
	const levelProgress = $derived(data.levelProgress);
	const totalStars = $derived(data.totalStars);
	const maxStars = $derived(data.maxStars);

	function getLevelColorClasses(stars: number, locked: boolean): string {
		if (locked) {
			return 'border-gray-500 bg-gray-200';
		} else if (stars === 3) {
			return 'border-yellow-500 bg-yellow-50';
		} else {
			return 'border-secondary bg-white';
		}
	}
</script>

<svelte:head>
	<title>Můj Profil | Deafio</title>
</svelte:head>

<Particles className="fixed inset-0" />
<Layout1 centered={false}>
	<div class="flex w-full max-w-150 flex-col gap-6">
		<div class="rounded-2xl border-4 border-secondary">
			<div class="flex flex-col gap-4 rounded-[12px] border-4 border-primary bg-white p-6">
				<Heading variant={3} className="text-center">Osobní informace</Heading>
				<div class="flex items-center gap-3">
					<Mail size={20} className="text-secondary" />
					<div class="flex flex-col">
						<Paragraph className="text-gray-500 text-sm">Email</Paragraph>
						<Paragraph className="font-semibold">{user.email}</Paragraph>
					</div>
				</div>
				<div class="flex items-center gap-3">
					<Calendar size={20} className="text-secondary" />
					<div class="flex flex-col">
						<Paragraph className="text-gray-500 text-sm">Registrován</Paragraph>
						<Paragraph className="font-semibold">
							{new Date(user.createdAt).toLocaleDateString('cs-CZ')}
						</Paragraph>
					</div>
				</div>
				<div class="flex flex-col items-center gap-3">
					<Heading variant={3}>Celkem hvězd</Heading>
					<div class="relative flex h-50 w-50 items-center justify-center">
						<svg class="absolute inset-0 -rotate-90 transform" viewBox="0 0 100 100">
							<circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="5" />
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="#fbbf24"
								stroke-width="5"
								stroke-dasharray={`${(totalStars / maxStars) * 282.7} 282.7`}
								stroke-linecap="round"
								class="transition-all duration-500"
							/>
						</svg>
						<div class="relative z-10 flex flex-col items-center justify-center">
							<div class="text-[50px] font-bold text-amber-500">{totalStars}</div>
							<div class="-mt-3.75 text-[30px] text-gray-500">/{maxStars}</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<GameButton onclick={() => (isOpen = !isOpen)} class="w-full" size="medium" variant={1}>
			<div class="flex w-full items-center justify-between">
				<span>Ukázat postup úrovní</span>
				<div class={cn('transition-transform duration-300', isOpen && 'rotate-180')}>
					<ChevronDown size={24} />
				</div>
			</div>
		</GameButton>
		{#if isOpen}
			<div class="flex flex-col gap-4" transition:slide>
				{#each levelProgress as level, i}
					<div
						transition:fly={{ x: 100, duration: 300, delay: i * 50 }}
						class={cn(
							'flex min-h-21 items-center  justify-between rounded-lg border-2 p-4 transition-colors',
							getLevelColorClasses(level.stars, level.locked)
						)}
					>
						<div class="flex flex-col">
							<Heading variant={3} className="text-lg">Úroveň {level.level}</Heading>
							{#if level.locked}
								<Paragraph className="text-gray-500 text-sm">Zamčeno</Paragraph>
							{:else if level.stars === 3}
								<Paragraph className="text-gray-500 text-sm">Dokončeno</Paragraph>
							{/if}
						</div>
						<div class="flex">
							{#if !level.locked}
								{#each Array(3) as _, i}
									<div class="flex">
										{#if i < level.stars}
											<Star size={40} color="gold" fill="gold" />
										{:else}
											<Star size={40} color="gray" fill="gray" />
										{/if}
									</div>
								{/each}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</Layout1>
