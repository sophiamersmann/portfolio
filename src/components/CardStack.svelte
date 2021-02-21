<script>
  import Card from './Card.svelte';

  import cards from '../inputs/cards';
</script>

<div class="stack">
  {#each cards as card (card.title)}
    <Card {...card} />
  {/each}
</div>

<style>
  .stack {
    padding: var(--spacing) 0;
    display: grid;
    grid-gap: var(--spacing);
    grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
  }
</style>
