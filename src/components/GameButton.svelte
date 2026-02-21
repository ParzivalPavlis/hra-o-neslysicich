<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '$components/ui/button';
	import { cn } from '$lib/utils';

	let {
		children,
		type = 'button',
		href,
		disabled = false,
		onclick = () => {},
		class: additionalClasses = '',
		variant = 1,
		size = 'medium'
	}: {
		children: Snippet;
		type?: 'button' | 'submit' | 'reset' | undefined | null;
		href?: string;
		disabled?: boolean;
		onclick?: () => void;
		class?: string;
		variant?: 1 | 2 | 3;
		size?: 'medium' | 'small' | 'large';
	} = $props();

	const variantClasses: Record<1 | 2 | 3, string> = {
		1: 'bg-blue-500 shadow-[0_6px_0_rgb(29,78,216)] hover:bg-blue-500 hover:shadow-[0_8px_0_rgb(29,78,216)] active:translate-y-0.5 hover:-translate-y-0.5 active:shadow-[0_4px_0_rgb(29,78,216)] disabled:bg-gray-500 disabled:shadow-[0_6px_0_rgb(55,65,81)]',
		2: 'bg-green-500 shadow-[0_6px_0_rgb(21,128,61)] hover:bg-green-500 hover:shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-0.5 hover:-translate-y-0.5 active:shadow-[0_4px_0_rgb(21,128,61)] disabled:bg-gray-500 disabled:shadow-[0_6px_0_rgb(55,65,81)]',
		3: 'bg-red-500 shadow-[0_6px_0_rgb(185,28,28)] hover:bg-red-500 hover:shadow-[0_8px_0_rgb(185,28,28)] active:translate-y-0.5 hover:-translate-y-0.5 active:shadow-[0_4px_0_rgb(185,28,28)] disabled:bg-gray-500 disabled:shadow-[0_6px_0_rgb(55,65,81)] ![&_svg:not([class*="size-"])]:size-9'
	};

	const sizeClasses: Record<'medium' | 'small' | 'large', string> = {
		medium: 'text-[20px] py-[8px] [&_svg:not([class*="size-"])]:size-6',
		small: 'text-[17px] py-[9px] [&_svg:not([class*="size-"])]:size-5',
		large: 'text-lg px-8 py-3'
	};
</script>

<Button
	{type}
	{href}
	{disabled}
	{onclick}
	class={cn(
		'h-fit cursor-pointer text-wrap whitespace-normal',
		additionalClasses,
		variantClasses[variant],
		sizeClasses[size]
	)}>{@render children()}</Button
>
