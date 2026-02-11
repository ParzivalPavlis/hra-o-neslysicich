<script lang="ts">
	import { Menu, Play } from '@lucide/svelte';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<nav class="fixed right-0 bottom-0 left-0 z-10 h-13 bg-foreground">
	<ul class="flex h-full items-end justify-around">
		<li>
			<a class="flex w-14 flex-col items-center" href="/">
				{#if page.url.pathname === '/'}
					<div
						class="absolute -top-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded"
						style="background: linear-gradient(to bottom, transparent 50%, white 50%)"
					>
						<Menu class="-rotate-45 transform" />
					</div>
				{:else}
					<Menu color="white" />
				{/if}
				<span class="text-white">Domů</span>
			</a>
		</li>
		<li>
			<a class="flex w-14 flex-col items-center" href="/levels">
				{#if page.url.pathname === '/levels'}
					<div
						class="absolute -top-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded"
						style="background: linear-gradient(135deg, transparent 50%, white 50%)"
					>
						<Play class="-rotate-45 transform" />
					</div>
				{:else}
					<Play color="white" />
				{/if}
				<span class="text-white">Úrovně</span>
			</a>
		</li>
	</ul>
</nav>
{@render children()}
