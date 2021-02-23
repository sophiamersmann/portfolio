<script>
  export let tags = [];
</script>

<div class="tags">
  {#each tags as tag}
    <span>{tag}</span>
  {/each}
</div>

<style>
  .tags {
    width: 100%;
    font-size: 0.85rem;
    margin-top: calc(var(--spacing) * 0.25);
    line-height: 1.5rem;
  }

  span {
    background-color: var(--primary-light);
    padding: 0 6px;
    border-radius: 20px;
    display: inline-block;
    white-space: nowrap;
    margin: 1px 2px 1px 0;
  }
</style>
