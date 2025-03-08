<script lang="ts">
	import Button from "../button/button.svelte";

	interface AddColumnButtonProps {
		onClick: () => void;
	}

	const { onClick }: AddColumnButtonProps = $props();
</script>

<Button lucideId="plus" {onClick} />
