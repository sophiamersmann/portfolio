<script>
  import Blob from './Blob.svelte';
  import Icon from './Icon.svelte';
  import LinkWrapper from './LinkWrapper.svelte';

  import social from '../inputs/social';
</script>

<div class="social-media">
  {#each social as { name, url } (name)}
    <div class="brand-icon">
      <LinkWrapper {url}>
        <Blob icon={name} position="back" />
        <Blob icon={name} position="front" />
        <Icon type={name} />
      </LinkWrapper>
    </div>
  {/each}
</div>

<style>
  .social-media {
    display: inline-flex;
  }

  .brand-icon :global(a) {
    display: grid;
    grid: [stack] 1fr / [stack] 1fr;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
  }

  .brand-icon :global(a > *) {
    grid-area: stack;
  }
</style>
