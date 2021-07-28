<script>
  /**
   * @name Img Svelte Component
   * @description Display either an image or a video, based on input
   * @param img {string} The image/video displayed to the user. This is the string that goes in the "src" area.
   * @param alt {string} The alt text of the image.
   * @param imgType {string} Either "image" or "video"
   * @param pos {string} The "Position" of the image.
   *    thumb: As is shown as thumbnails on the Characters page
   *    modal: As is shown in the CHaracter page modal
   *    welcome: As shown on the Options page, for the welcome image.
   * @param icon {string} Default is the mdiAccountQuestion icon. Otherwise, fill with SVG path data.
   */

  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiAccountQuestion } from '@mdi/js'

  export let img, 
    alt = "", 
    imgType, 
    pos,
    icon = mdiAccountQuestion

  /**
   * Animation loop is based off the images "pos"
   * @returns {boolean} 
   */
  function checkLoop() {
    return ['modal', 'welcome'].includes(pos)
  }
</script>

<div class='img {pos}'>
  {#if img && imgType && imgType==='image'}
    <img src='{img}' alt='{alt}'/>
  {:else if img && imgType && imgType==='video' }
    <video autoplay loop={checkLoop()}>
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
  overflow: auto;
  object-fit: cover;
}

// Thumb IMG type
.thumb {
  width: 7rem;
  height: 7rem;
  margin: auto;
  img video { border-radius: .5rem; }
  @media screen and (max-width: 500px) {
    width: 5rem; height: 5rem;
    img {border-radius: .25rem;}
  }
}

.modal {
  width: 15rem; height: 15rem;
  img, video{
    object-fit: contain;
  }
}

.welcome {
  img video {

    display: block;
    flex-grow: 1;
    height: 10rem;
    object-fit: contain;
  }
}

</style>