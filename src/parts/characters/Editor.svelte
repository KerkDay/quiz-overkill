<script>
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiImagePlus, mdiImageRemove, mdiAccountRemove, mdiAccountMultiple } from '@mdi/js'
  import { createEventDispatcher } from 'svelte'
  import imageCompress from '../../scripts/imageCompress'
  import Modal from '../Modal.svelte'
  import ImgOverlay from '../ImgOverlay.svelte'

  export let char, index

  const dispatch = createEventDispatcher();

  function handleRemoveImg() {
    char.img = null
  }

  async function handleUploadImg(input) {
    document.activeElement.blur()
    try {
      let img = input.target.files[0]
      let oldType = char.imgType
      char.imgType = 'loading'
      let data = await imageCompress(img)
      console.log(`[Image Compress Data] ${JSON.stringify(data)}`)
      if (data && data.type && data.url) {
        char.imgType = data.type
        char.img = data.url
      } else { char.imgType = oldType }
    } catch (e) { char.imgType = oldType }
  }

</script>


<Modal on:open arrows>
  <!-- Image -->
  <ImgOverlay img={char.img} alt={char.id} imgType={char.imgType} pos="modal">
    {#if char.img}
      <div class='remove-img' on:click={handleRemoveImg} tabindex="0">
        <SvgIcon path={mdiImageRemove} type='mdi' size='1em'/>
        <span> Remove Image</span>
      </div>
    {/if}
    <label class='change-img' tabindex="0">
      <SvgIcon path={mdiImagePlus} type='mdi' size='1em'/>
      <span> Upload Image</span>
      <input type='file' accept='image/*' hidden on:change={handleUploadImg} />
    </label>
  </ImgOverlay>

  <!-- Name -->
  <label class='name'>
    <optname>Name</optname>
    <input type='text' maxLength='30' placeholder='Nobody' bind:value={char.name}/>
  </label>

  <!-- Description -->
  <label class='desc'>
    <optname>Description</optname>
    <textarea placeholder='Descriptionless' bind:value={char.desc}></textarea>
  </label>

  <div class="char-btns">
    <button class='duplicate' data-tooltip="Duplicate" tabindex="0"
    on:click={()=> dispatch('duplicate', index)}
    >
      <SvgIcon path={mdiAccountMultiple} type="mdi" size="2em" />
    </button>
    <button class='remove' data-tooltip="Remove" tabindex="0"
    on:click={()=> { dispatch('remove', index) }}
    >
      <SvgIcon path={mdiAccountRemove} type="mdi" size="2em" />
    </button>
  </div>
</Modal>

<style lang="scss">
.change-img, .remove-img { pointer-events: auto !important;}
.change-img { color: var(--blue); }
.remove-img { color: var(--red); }
.change-img, .remove-img { 
  cursor: pointer; 
  margin: 1em; 
  pointer-events: none;
  font-weight: bold;
  text-shadow: 0 0 1em black;
  top: 50%;
}


/* Character Inputs */
input:not([type='checkbox'], [type='radio']), textarea {
  padding-top: 1.5rem;
}
@mixin input-label {
  position: absolute;
  top: .5rem;
  left: .5rem;
  color: var(--grey);
  font-size: .75rem;
}
.name, .desc {
  position: relative;
  display: block;
  margin-top: .5rem;
  optname {
    @include input-label
  }
}
textarea {
  height: 100%;
  resize: none;
}
.char-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: .5rem;
  margin-top: .5rem;
  button {
    border: none;
  }
  .duplicate {
    background: var(--blue);
  }
  .remove {
    background: var(--red);
  }
}

</style>