<script>
  export let url;
</script>

<a target="_blank" href={url}>
  <slot />
</a>

<style>
  a,
  a:link,
  a:visited,
  a:hover,
  a:active {
    color: inherit;
    text-decoration: inherit;
  }
</style>
