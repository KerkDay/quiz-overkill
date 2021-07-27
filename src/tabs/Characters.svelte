<script>
  /**
   * @author Kerk Day
   */
  import {getContext} from 'svelte'
  import debounce from 'lodash/debounce'
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiAccountPlus, mdiImageMultiple  } from '@mdi/js'
  import imageCompress from '../scripts/imageCompress'

  import Character from '../parts/characters/Character.svelte'

  let characters = getContext('characters')
  let opened = null

  let idChars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz🧙']

  /**
   * A function to charcge which characters modal is showing.
   * @param val Which character should be opened?
   */
  let handleOpen = debounce((val) => { 
      if (val >= $characters.length) val = 0
      else if (val < 0) val = $characters.length - 1

      // If moved via left/right arrows
      if ( typeof opened === 'number' && typeof val === 'number' && $characters[val] ) {
        let el = document.querySelector(`#${$characters[val].id}`).getBoundingClientRect()
        window.scrollBy({top: el.top - (el.height*2), behavior: 'smooth'})
      }
      opened = val 
    })

  function handleNewCharacter({id, name, desc, img}) {
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
      img: img ? img : null,
      imgType: null
    })
    $characters = [...$characters]// A cheat to display the new character
  }

  async function handleImportImages(input) {
    let files = input.target.files
    for (let i in files) {
      let img = await imageCompress(files[i])
      if (img) {
        handleNewCharacter({
          name: files[i].name.split('.')[0],
          img: img
        })
      }
    }
  }

</script>

<div>
  <!-- Controls -->
  <controls>

    <!-- New Character -->
    <button id='new-char-button' on:click={()=>{
        handleNewCharacter({}); 
        handleOpen($characters.length-1);
      }}>
      <SvgIcon path={mdiAccountPlus} type='mdi' size='1em' />
      Add Character
    </button>

    <!-- Add From Images -->
    <label>
      <SvgIcon path={mdiImageMultiple} type='mdi' size='1em' />
      Add Characters from Images
      <input type='file' accepts='image/*' multiple hidden on:change={handleImportImages}/>
    </label>

  </controls>

  <!-- Characters -->
  <characters>
    {#each $characters as char, index }
      <Character 
        {char}
        {opened}
        {index}
        {handleOpen}
      />
    {/each}
  </characters>
</div>

<style lang='scss'>
  controls {
    display: block;
    margin-bottom: 1em;
    button, label {
      display: inline-block;
      font-size: 1rem;
      padding: 1ch .5rem;
      border: none;
      background: black;
      border-radius: .5rem;
      color: white;
      cursor: pointer;
      margin: 0 .5ch;
      &:hover, &:focus { background: var(--black); }
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