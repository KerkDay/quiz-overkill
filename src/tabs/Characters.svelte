<script>
  import {getContext} from 'svelte'
  import debounce from 'lodash/debounce'
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiAccountPlus  } from '@mdi/js'
  import imageCompression from 'browser-image-compression'

  import Character from '../parts/characters/Character.svelte'

  let characters = getContext('characters')
  let opened = null

  let idChars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz🧙']

  let handleOpen = debounce((val) => { 
    if (val >= $characters.length) val = 0
    else if (val < 0) val = $characters.length - 1
    if (
        typeof opened === 'number' 
        && typeof val === 'number' 
        && $characters[val]
      ) {
      let el = document.querySelector(`#${$characters[val].id}`).getBoundingClientRect()
      window.scrollBy({top: el.top - el.height, behavior: 'smooth'})
    }
    opened = val 
  })

  function handleNewCharacter(id, name, desc, img) {
    function randChar() {
      return idChars[ Math.floor( Math.random() * idChars.length ) ]
    }
    // This function runs recursively. Seems reckless maybe?
    // Make the ID required, and check it against all the characters
    function makeID() {
      id = randChar() + randChar()
      for (let char in $characters) {
        if (char.id === id) makeID()
      }
    }
    if (typeof id === 'undefined') makeID()
    $characters.push({
      id: id,
      name: name ? name: '',
      desc: desc ? desc : '',
      img: img ? img : null
    })
    opened = [$characters.length-1] // Automatically open the new character.
  }

  async function compressImg(img) {
    if (/image\/*/g.test(img.type)) {
      try {
        const compressedImg = await imageCompression(img, {
          maxWidthOrHeight: 300,
          useWebWorker: true
        })
        return await imageCompression.getDataUrlFromFile(compressedImg)
      } catch (err) {
        return
      }
    } else {
      return
    }
  }
</script>

<div>
  <!-- Controls -->
  <controls>

    <!-- New Character -->
    <button id='new-char-button' on:click={()=>handleNewCharacter()}>
      <SvgIcon path={mdiAccountPlus} type='mdi' size='1em' />
      Add Character
    </button>

    <!-- Add From Images -->

  </controls>

  <!-- Characters -->
  <characters>
    {#each $characters as char, index }
      <Character 
        {char}
        {opened}
        {index}
        {handleOpen}
        {compressImg}
      />
    {/each}
  </characters>
</div>

<style lang='scss'>
  controls {
    display: block;
    margin-bottom: 1em;
    button {
      font-size: 1rem;
      padding: 1ch .5rem;
      border: none;
      background: black;
      border-radius: .5rem;
      color: white;
      cursor: pointer;
    }
    #new-char-button {
      background: var(--blue);
    }
  }
  characters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8em, 8em));
    grid-gap: 1rem;
    max-width: 1920px;
    margin: auto;
    justify-content: center;
    @media screen and (max-width:500px) {
      grid-template-columns: repeat(auto-fit, minmax(6em, 6em));
    }
  }
</style>