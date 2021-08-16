<script>
  // Svelte Stuff
  import { createEventDispatcher } from 'svelte';

  // Components
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiImagePlus, mdiImageRemove, mdiAccountRemove, mdiAccountMultiple } from '@mdi/js'
  import debounce from 'lodash/debounce'
  
  import imageCompress from '../../scripts/imageCompress'
  import {send, receive} from '../../scripts/crossfade'

  import Img from '../Img.svelte'
  import Modal from '../Modal.svelte'

  // Imported Stuff
  export let char, opened, handleOpen, index
  
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

	document.addEventListener('keydown', debounce((e) => {
    if (opened === index) {
      
      // Don't move foward or back if
      let inputs = document.querySelectorAll(`#${char.id} textarea, ${char.id} input`)
      for (let input of inputs)
        if (input === document.activeElement) return

      // Check for appropriate keys
      if ( e.key === 'ArrowLeft' )
        handleOpen(index-1)
      else if ( e.key === 'ArrowRight')
        handleOpen(index+1)

    }
	}))

  

</script>



<character id={char.id}>

  {#if opened !== index}
  <div class='thumb' on:click={handleOpen(index)}
    in:receive="{{key: char.id}}"
    out:send="{{key: char.id}}"
  >
    <!-- Image -->
    <Img img={char.img} alt={char.name} imgType={char.imgType} pos="thumb"/>

    <!-- Desc -->
    <div>
      {#if char.name}
        <strong>{char.name}</strong>
      {:else}
        <strong style='color:var(--grey)'>Nobody</strong>
      {/if}
    </div>
  </div>

  {:else}
    <Modal {handleOpen} {index} >
      <left>
        <!-- Image -->
        <Img img={char.img} alt={char.name} imgType={char.imgType} pos="modal">
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
        </Img>

        <!-- Name -->
        <label class='name'>
          <optname>Name</optname>
          <input type='text' maxLength='30' placeholder='Nobody' bind:value={char.name}/>
        </label>
      </left>

      <right>
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
            on:click={()=> {
              dispatch('remove', index)
              
              }}>
            <SvgIcon path={mdiAccountRemove} type="mdi" size="2em" />
          </button>
        </div>
        
      </right>
    </Modal>

  {/if}
  
</character>



<style lang='scss'>

character { display: block; }

.thumb {
  background: black;
  border-radius: .5rem;
  padding: .5rem;
  @media screen and (max-width: 500px) {
    border-radius: .25rem; padding: .25rem;
  }
}

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
  optname {
    @include input-label
  }
}

right {
  display: flex;
  flex-direction: column;
  width: 16rem; 
  .desc { flex-grow: 1; }
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
}


</style>