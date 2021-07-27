<script>
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiAccountQuestion } from '@mdi/js'

  export let img, alt, imgType, pos
  export let icon = mdiAccountQuestion
</script>

<div class='img {pos}'>
  {#if img && imgType && imgType==='image'}
    <img src='{img}' alt='{alt}'/>
  {:else if img && imgType && imgType==='video' }
    <video autoplay loop>
      <source src='{img}' type="video/mp4">
      <track kind="captions">
      Your browser doesn't support videos.
    </video>
  {:else}
    <div class='default-img'>
      <SvgIcon path={icon} type='mdi' size='2em'/>
      <br />
      No Image
    </div>
  {/if}
</div>

<style lang="scss">
.img { 
  font-size: .75rem; 
  color: var(--grey); 
  display: grid;
  place-items: center;
}

img, video {
  display: block;
  width: 100%; height: 100%;
  object-fit: cover;
}
video {
  object-fit: contain;
}

// Thumb IMG type
.thumb {
  width: 7rem;
  height: 7rem;
  margin: auto;
  img video { border-radius: .5rem; }
  @media screen and (max-width: 500px) {
    .img {width: 5rem; height: 5rem; }
    img {border-radius: .25rem;}
  }
}

.modal {
  .img {
    img {
      object-fit: contain;
      width: 15rem; height: 15rem;
    }
  }
}

</style>