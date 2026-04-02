<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import ConversationButton from '$components/ConversationButton.svelte';
	import EmblaCarousel from 'embla-carousel';
	import type { EmblaCarouselType } from 'embla-carousel';
	import type { ConversationOptionType } from '$types/answer';
	import GameButton from '$components/GameButton.svelte';

	type Props = {
		options: ConversationOptionType[];
		selectedIndex?: number;
		disabled: boolean;
		onOptionClick: (index: number) => void;
		variant: (optionId: string) => 1 | 2 | 3;
		getDisabledOption?: (optionId: string) => boolean;
	};

	let {
		options,
		selectedIndex = 0,
		disabled,
		onOptionClick,
		variant,
		getDisabledOption = () => false
	}: Props = $props();

	let emblaRef: HTMLElement | undefined = $state();
	let emblaAPI: EmblaCarouselType | undefined = $state();
	let canScrollPrev = $state(false);
	let canScrollNext = $state(false);
	let currentCarouselIndex = $state(0);

	function onSelect(api: EmblaCarouselType) {
		canScrollPrev = api.canScrollPrev();
		canScrollNext = api.canScrollNext();
		currentCarouselIndex = api.selectedScrollSnap();
	}

	$effect(() => {
		if (!emblaRef) return;

		const embla = EmblaCarousel(emblaRef, {
			align: 'start'
		});

		emblaAPI = embla;
		onSelect(embla);
		embla.on('select', () => onSelect(embla));

		return () => {
			embla.destroy();
		};
	});

	$effect(() => {
		if (emblaAPI && selectedIndex !== undefined) {
			emblaAPI.scrollTo(selectedIndex);
		}
	});

	function scrollPrev() {
		if (emblaAPI) emblaAPI.scrollPrev();
	}

	function scrollNext() {
		if (emblaAPI) emblaAPI.scrollNext();
	}
</script>

<div class="flex w-full flex-col gap-2 select-none" role="region" aria-label="Answer Navigator">
	<div class="overflow-hidden" bind:this={emblaRef}>
		<div class="flex gap-4">
			{#each options as option, index}
				<div class="min-w-0 flex-[0_0_100%] p-2">
					<ConversationButton
						dialogue={option.dialogue}
						disabled={disabled || getDisabledOption(option.id)}
						variant={variant(option.id)}
						onClick={() => onOptionClick(index)}
					/>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex w-full items-center justify-between gap-4">
		<GameButton
			type="button"
			onclick={scrollPrev}
			disabled={!canScrollPrev || disabled}
			class="min-h-11.25 cursor-pointer rounded-lg border-2 border-primary bg-white p-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
		>
			<ChevronLeft size={24} />
		</GameButton>
		<span class="flex-1 text-center text-lg font-semibold">
			{currentCarouselIndex + 1} / {options.length}
		</span>
		<GameButton
			type="button"
			onclick={scrollNext}
			disabled={!canScrollNext || disabled}
			class="min-h-11.25 cursor-pointer rounded-lg border-2 border-primary bg-white p-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
		>
			<ChevronRight size={24} />
		</GameButton>
	</div>
</div>
