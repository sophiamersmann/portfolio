<script>
  import SocialMedia from './SocialMedia.svelte';
</script>

<header>
  <div class="brand">
    <img src="img/memoji-421x421.png" alt="Memoji" width="421" height="421" />
    <h1>Sophia Mersmann</h1>
  </div>
  <SocialMedia />
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .brand {
    flex: 1 0 auto;
  }

  img {
    width: 4rem;
    height: auto;
    border-radius: 50%;
    vertical-align: middle;
    background-color: var(--accent-light);
  }

  h1 {
    display: inline;
    vertical-align: middle;
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.3rem;
    letter-spacing: 0.5px;
    margin-left: calc(var(--spacing) * 0.5);
  }
</style>
