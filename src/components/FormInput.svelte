<script lang="ts">
	type Props = {
		id: string;
		name: string;
		label: string;
		type?: string;
		placeholder?: string;
		value?: string;
		error?: string;
		required?: boolean;
	};

	let {
		id,
		name,
		label,
		type = 'text',
		placeholder = '',
		value = '',
		error,
		required = false
	}: Props = $props();
</script>

<div>
	<label for={id} class="block text-sm font-medium text-gray-700">{label}</label>
	<input
		{id}
		{name}
		class="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
		{type}
		{placeholder}
		{value}
		{required}
	/>
	{#if error}
		<span class="mt-1 flex items-center text-sm text-red-600">
			{error}
		</span>
	{/if}
</div>
