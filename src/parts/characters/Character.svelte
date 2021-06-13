<script>
  // Svelte Stuff
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';

  // Image Compression 
  import imageCompression, { getDataUrlFromFile } from 'browser-image-compression'

  // Components
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiArrowLeftCircle, mdiArrowRightCircle, mdiImagePlus, mdiImageRemove, mdiAccountQuestion  } from '@mdi/js';

  // Imported Stuff
  export let char, opened, prev, next, handleOpen

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
    let img = input.target.files[0]
    if (/image\/*/g.test(img.type)) {
      

      try {
        const compressedImg = await imageCompression(img, {
          maxWidthOrHeight: 300,
          useWebWorker: true
        })
        char.img = await imageCompression.getDataUrlFromFile(compressedImg)
      } catch (err) {
      }
    }
  }

</script>

<character >

  {#if opened !== char.id}
  <div class='thumb' on:click={handleOpen(char.id)}
    in:receive="{{key: char.id}}"
    out:send="{{key: char.id}}"
  >
    <!-- Image -->
    <div class='img'>
      {#if char.img}
        <img src='{char.img ? char.img : ''}' alt='{char.name}'/>
      {:else}
        <div class='default-img'>
          <SvgIcon path={mdiAccountQuestion} type='mdi' size='2em'/>
          <br />
          No Image
        </div>
      {/if}
    </div>

    <!-- Desc -->
    <div>
      <strong>{char.name}</strong>
    </div>
  </div>

  {:else}
    <div class='modal-outer' on:click|self={handleOpen('')}>
      <div class='modal-inner'
        in:receive="{{key: char.id}}"
        out:send="{{key: char.id}}"
      >
          <left>
            <!-- Image -->
            <div class='img'>
              {#if char.img}
                <img src='{char.img ? char.img : ''}' alt='{char.name}'/>
              {:else}
                <div class='default-img'>
                  <SvgIcon path={mdiAccountQuestion} type='mdi' size='2em'/>
                  <br />
                  No Image
                </div>
              {/if}
              
              
              <div class='overlay'>
                <label class='change-img'>
                  <SvgIcon path={mdiImagePlus} type='mdi' size='1em'/>
                  <span> Upload Image</span>
                  <input type='file' accept='image/*' hidden on:change={handleUploadImg} />
                </label>
                <div class='remove-img' on:click={handleRemoveImg}>
                  <SvgIcon path={mdiImageRemove} type='mdi' size='1em'/>
                  <span> Remove Image</span>
                </div>
              </div>
            </div>

            <!-- Name -->
            <div class='name'>
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label>Name</label>
              <input type='text' maxLength='30' placeholder='Nobody' bind:value={char.name}/>
            </div>
          </left>

          <right>
            <!-- Description -->
            <div class='desc'>
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label>Description</label>
              <textarea placeholder='Descriptionless' bind:value={char.desc}></textarea>
            </div>
            
          </right>
      </div>

      <!-- Purely Costmetic Close Icon -->
      <x>&times;</x>

      <!-- Previous Item -->
      <!-- TODO: Doesnt work! -->
      {#if prev}
      <div class='prev' on:click={handleOpen(prev)}>
        <SvgIcon path={mdiArrowLeftCircle} type='mdi' size='2em'/>
      </div>
      {/if}
      <!-- Next item -->
      {#if next}
      <div class='next' on:click={handleOpen(next)}>
        <SvgIcon path={mdiArrowRightCircle} type='mdi' size='2em'/>
      </div>
      {/if}
    </div>

  {/if}
  
</character>

<style lang='scss'>

character { width: 8rem; height: 8.5rem; }


.img {
  font-size: .75rem;
  color: var(--grey);
}

.thumb {
  background: black;
  border-radius: .5rem;
  padding: .5rem;
  .img {
    width: 7rem;
    height: 7rem;
    display: grid;
    place-items: center;
    img {
      display: block;
      width: 100%; height: 100%;
      object-fit: cover;
    }
  }
}

@media screen and (max-width: 500px) {
  character { width: 6em; height: 6.5em; }
  .thumb {
    border-radius: .5rem; padding: .5rem;
    img { width: 5rem; height: 5rem; }
  }
}


.modal-outer {
  display: grid;
  place-items: center;
  position: fixed;
  z-index: 4;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0);
  &:last-of-type {background: rgba(0,0,0,0.9);}
}
x {
  pointer-events: none;
  position: fixed;
  top: .5em;
  right: 1ch;
  color: var(--grey);
  font-size: 2rem;
}
.modal-inner {
  display: grid;
  grid-template-columns: auto auto;
  border-radius: 1em;
  pointer-events: visible;
  transition: all 1s;
  padding: 1em;
  margin: 2ch;
  grid-gap: 1em;

  @media screen and (max-width: 500px) {grid-template-columns: auto;}
  .img {
    display: grid;
    place-items: center;
    width: 15rem;
    height: 15rem;
    padding: .5rem;
    background-color: var(--black);
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .overlay {
      position: absolute;
      left: 0; right: 0;
      top: 0; bottom: 0;
      opacity: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 1rem;
      background: rgba(0,0,0,0.75);
      &:hover {
        opacity: 1;
      }
      .change-img { color: var(--blue); }
      .remove-img { color: var(--red); }
      .change-img, .remove-img {cursor:pointer; margin: 1em;}
    }
  }
}

.name {
  position: relative;
  label {
    position: absolute;
    top: .5rem;
    left: .5rem;
    color: var(--grey);
    font-size: .75rem;

  }
  input {
    border: none;
    background: var(--black);
    border-bottom: 1px solid var(--grey);
    color: var(--white);
    font-size: 1rem;
    font-family: var(--font);
    padding: 1.5rem .5rem .5rem .5rem;
    width: 15rem;
    &:focus { outline: none; }
    &::placeholder { color: var(--grey); }
  }
}
.desc {
  display: flex;
  height: 100%;
  flex-direction: column;
  position: relative;
  label {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    color: var(--grey);
    z-index: 6;
    font-size: .75rem;
  }
  textarea {
    width: 100%;
    resize: none;
    background: var(--black);
    border: none;
    border-bottom: 1px solid var(--grey);
    color: var(--white);
    font-size: 1rem;
    font-family: var(--font);
    flex-grow: 1;
    padding: 1.5rem .5rem .5rem .5rem;
    &:focus { outline: none; }
    &::placeholder { color: var(--grey); }
  }
}

.prev, .next {
  display: block;
  position: fixed;
  color: var(--white);
  &:hover {color: var(--grey);}
  z-index: 5;
}
.prev {left: 1em;}
.next {right: 1em;}

</style>