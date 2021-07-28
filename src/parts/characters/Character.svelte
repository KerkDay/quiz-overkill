<script>
  // Svelte Stuff
	import { quintOut } from 'svelte/easing'
	import { crossfade, fade } from 'svelte/transition'

  // Components
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiArrowLeftCircle, mdiArrowRightCircle, mdiImagePlus, mdiImageRemove, mdiAccountQuestion  } from '@mdi/js'
  import debounce from 'lodash/debounce'
  
  import imageCompress from '../../scripts/imageCompress'

  import Img from '../Img.svelte'

  // Imported Stuff
  export let char, opened, handleOpen, index

  // Fade between opened/unopened items
  const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return { duration: 600, easing: quintOut, css: t => ` transform: ${transform} scale(${t}); opacity: ${t} ` };
		}
	});

  function handleRemoveImg() {
    char.img = null
  }
  async function handleUploadImg(input) {
    document.activeElement.blur()
    let img = input.target.files[0]
    let oldType = char.imgType
    char.imgType = 'loading'
    let data = await imageCompress(img)
    console.log(`[Image Compress Data] ${JSON.stringify(data)}`)
    if (data && data.type && data.url) {
      char.imgType = data.type
      char.img = data.url
    } else {
      char.imgType = oldType
    }
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
    <div class='modal-outer' on:click|self={handleOpen(null)}>
      <div class='modal-inner'
        in:receive="{{key: char.id}}"
        out:send="{{key: char.id}}"
      >
          <left>
            <!-- Image -->
            <button class='img'>
              <Img img={char.img} alt={char.name} imgType={char.imgType} pos="modal"/>
              
              <div class='overlay'>
                <label class='change-img'>
                  <SvgIcon path={mdiImagePlus} type='mdi' size='1em'/>
                  <span> Upload Image</span>
                  <input type='file' accept='image/*' hidden on:change={handleUploadImg} />
                </label>
                {#if char.img}
                  <div class='remove-img' on:click={handleRemoveImg}>
                    <SvgIcon path={mdiImageRemove} type='mdi' size='1em'/>
                    <span> Remove Image</span>
                  </div>
                {/if}
              </div>
            </button>

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
            
          </right>
      </div>

      <!-- Purely Costmetic Close Icon -->
      <x transition:fade >&times;</x>

      <!-- Previous Item -->
      <!-- TODO: Doesnt work! -->
      <div class='prev' on:click={handleOpen(index-1)} transition:fade>
        <SvgIcon path={mdiArrowLeftCircle} type='mdi' size='2em'/>
      </div>
      <!-- Next item -->
      <div class='next' on:click={handleOpen(index+1)} transition:fade>
        <SvgIcon path={mdiArrowRightCircle} type='mdi' size='2em'/>
      </div>
    </div>

  {/if}
  
</character>



<style lang='scss'>

@mixin inset { top: 0; left: 0; right: 0; bottom: 0; }

character { display: block; }

.thumb {
  background: black;
  border-radius: .5rem;
  padding: .5rem;
}

@media screen and (max-width: 500px) {
  .thumb {
    border-radius: .25rem; padding: .25rem;
  }
}


.modal-outer {
  display: grid;
  place-items: center;
  position: fixed;
  @include inset;
  &:last-of-type {background: rgba(0,0,0,0.9); z-index: 5;}
}
x {
  pointer-events: none;
  position: fixed;
  top: .5em; right: 1ch;
  color: var(--grey);
  font-size: 2rem;
}
.modal-inner {
  display: grid;
  grid-template-columns: auto auto;
  border-radius: 1em;
  transition: all 1s;
  padding: 1em; margin: 2ch;
  grid-gap: 1em;
  @media screen and (max-width: 500px) {grid-template-columns: auto;}
  .img {
    padding: .5rem;
    background-color: var(--black);
    position: relative;
    border: 0;
    width: 100%;
    min-height: 5em;
    &:hover, &:focus {
      outline: none;
      .overlay { opacity: 1; }
      .change-img, .remove-img { pointer-events: auto !important;}
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
  }
}
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
@mixin input {
  font-family: var(--font); font-size: 1rem;
  color: var(--white);
  background: var(--black);
  border: none;
  border-bottom: 1px solid var(--grey);
  padding: 1.5rem .5rem .5rem .5rem;
  width: 100%;
  &:focus { outline: none; }
  &::placeholder { color: var(--grey); }
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
  input, textarea {
    @include input;
    resize: none;
  }
}
.desc textarea {
  height: 19.2em;
}

.prev, .next {
  display: block;
  position: fixed;
  color: var(--white);
  &:hover {color: var(--grey);}
  top: 50%;
  @media screen and (max-width: 500px) {
    top: unset;
    bottom: 1em;
  }
}
.prev {left: 1em;}
.next {right: 1em;}

</style>