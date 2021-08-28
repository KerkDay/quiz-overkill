<script>
  /**
   * @name ImgOverlay Svelte Component
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

  import Img from './Img.svelte'
  import { mdiAccountQuestion } from '@mdi/js'

  export let img, alt, imgType, pos, icon=mdiAccountQuestion
</script>

<button>
  <Img {img} {alt} {imgType} {pos} {icon} />

  {#if $$slots.default}
    <div class='overlay'>
      <slot>
        {alt}
      </slot>
    </div>
  {/if}
</button>

<style lang="scss">
@mixin inset { top: 0; left: 0; right: 0; bottom: 0; }
button { 
  border: none;
  margin: 0;
  padding: 0;
  position: relative;
  &:hover, &:focus, &:focus-within {
    outline: none;
    .overlay { opacity: 1; }
  }
}
.overlay {
  position: absolute;
  @include inset;
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1rem;
  background: rgba(0,0,0,0.75);
}

</style>