<script>
  import LinkWrapper from './LinkWrapper.svelte';
  import Tags from './Tags.svelte';
  import Icon from './Icon.svelte';

  export let title;
  export let subtitle;
  export let tags = [];
  export let date = new Date();
  export let url;
  export let imageUrl;
  export let githubUrl;

  const dateOptions = { month: 'short', year: 'numeric' };

  const pad = (num) => num.toString().padStart(2, 0);
  const machineDate = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-');
</script>

<div class="card">
  <LinkWrapper {url}>
    <img src={imageUrl} alt={title} width="512" height="384" />
  </LinkWrapper>
  <div class="caption">
    <div class="top">
      <LinkWrapper {url}>
        <span class="title">{title}</span>
        <span class="subtitle">{subtitle}</span>
        <Tags {tags} />
      </LinkWrapper>
    </div>
    <div class="bottom">
      <time datetime={machineDate}>
        {date.toLocaleDateString('en-UK', dateOptions)}
      </time>
      {#if githubUrl}
        <span class="separator">/</span>
        <LinkWrapper url={githubUrl}>
          <div class="icon-wrapper">
            Source
            <Icon type="github" />
          </div>
        </LinkWrapper>
      {/if}
    </div>
  </div>
</div>

<style>
  img {
    width: 100%;
    height: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    transition: all calc(var(--transition-duration) / 2);
  }

  img:hover {
    transform: translateY(-6px);
    transition: all var(--transition-duration) ease-out;
  }

  .caption {
    margin-top: calc(var(--spacing) * 0.25);
  }

  .separator {
    color: var(--primary);
    font-weight: bold;
  }

  .title {
    font-weight: 500;
  }

  .subtitle {
    font-weight: 300;
  }

  .top:hover {
    cursor: pointer;
  }

  .top:hover .title {
    text-decoration: underline;
    text-decoration-color: var(--primary);
    text-decoration-thickness: 3px;
  }

  .bottom {
    font-size: 0.85rem;
    margin-top: calc(var(--spacing) * 0.25);
  }

  .icon-wrapper {
    display: inline-flex;
    align-items: center;
  }

  .icon-wrapper:hover {
    text-decoration: underline;
    text-decoration-color: var(--primary);
    text-decoration-thickness: 2px;
  }

  .icon-wrapper :global(.icon) {
    fill: var(--black);
    opacity: 1;
    height: 1.35em;
    width: 1.35em;
    margin-left: 2px;
  }
</style>
