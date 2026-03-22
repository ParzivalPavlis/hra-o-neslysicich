<script lang="ts">
	import ReplayButton from '$components/ReplayButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
</script>

<div class="flex w-full flex-col items-center justify-center gap-5">
	<Paragraph>Jednotlivá videa můžete přehrávat znovu pomocí tlačítka níže:</Paragraph>
	<ReplayButton helpUses={3} />
	<Paragraph>
		Tlačítko má ale omezený počet použití indikovaný číslem v černém kolečku, takže ho využívejte s
		rozmyslem.
	</Paragraph>
</div>
