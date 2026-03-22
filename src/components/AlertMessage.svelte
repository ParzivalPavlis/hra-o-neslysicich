<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		message: string;
		variant: 'success' | 'error';
	};

	const { message, variant }: Props = $props();

	const variantClasses: Record<'success' | 'error', string> = {
		success: 'border border-green-200 bg-green-50 text-green-800',
		error: 'border border-red-200 bg-red-50 text-red-800'
	};
</script>

<div class={cn('rounded-md p-4 text-center text-sm', variantClasses[variant])}>
	{message}
</div>
