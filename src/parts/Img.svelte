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
  import { mdiAccountQuestion, mdiLoading } from '@mdi/js'
  import { fade } from 'svelte/transition';

  export let img, 
    alt = "", 
    imgType, 
    pos,
    icon = mdiAccountQuestion

  function playVideo(event) {
    if (!checkLoop()) {
      event.target.loop = true
      event.target.play()
    }
  }
  function stopVideo(event) {
    if (!checkLoop()) {
      event.target.loop = checkLoop()
      event.target.pause()
    }
  }

  /**
   * Animation loop is based off the images "pos"
   * @returns {boolean} 
   */
  function checkLoop() {
    return ['modal', 'welcome'].includes(pos)
  }
</script>

<div class='img {pos}'>
  {#if imgType === 'loading'}
    <div transition:fade class='default-img' >
      <span class='loading'>
        <SvgIcon path={mdiLoading} type='mdi' size='2em'/>
      </span>
      <br />
      Loading
    </div>
  {:else if img && imgType && imgType==='image'}
    <img transition:fade src='{img}' alt='{alt}'/>
  {:else if img && imgType && imgType==='video' }
    <video transition:fade autoplay loop={checkLoop()}
      on:mouseover={playVideo}
      on:focus={playVideo}
      on:mouseleave={stopVideo}
    >
      <source src='{img}' type="video/mp4">
      <track kind="captions">
      Your browser doesn't support videos.
    </video>
  {:else}
    <div transition:fade class='default-img'>
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
  width: 100%;
  position: relative;
}

img, video {
  display: block;
  position: absolute;
  left: 0; right: 0;
  top: 0; bottom: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}

// Thumb IMG type
.thumb {
  width: 7rem;
  height: 7rem;
  margin: auto;
  img, video { border-radius: .5rem; }
  @media screen and (max-width: 500px) {
    width: 5rem; height: 5rem;
    img, video {border-radius: .25rem;}
  }
}

@keyframes spinner { from {transform: rotateZ(0deg)} to {transform: rotateZ(360deg)} }
.default-img { text-align: center; }
.loading{
  display: block;
  animation: spinner 1s ease-in-out infinite;
}
.modal {
  width: 15rem; height: 15rem;
  img, video{ object-fit: contain; }
}

.welcome {
  
  height: 10rem;
  img, video {
    display: block;
    flex-grow: 1;
    object-fit: contain;
  }
}

</style>