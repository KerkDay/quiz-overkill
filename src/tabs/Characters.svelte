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

  let shadow = false
  document.addEventListener('scroll', debounce(() => {
    shadow = window.scrollY > 0
  }))

  /**
   * A function to charcge which characters modal is showing.
   * @param val Which character should be opened?
   */
  let handleOpen = debounce((val) => { 
    if (val >= $characters.length) val = 0
    else if (val < 0) val = $characters.length - 1

    // If moved via left/right arrows, scroll to them
    if ( typeof opened === 'number' && typeof val === 'number' && $characters[val] ) {
      scrollTo(val)
    }
    opened = val 
  })

  /**
   * Scroll down to a specific character
   * @param val {string/number} Either the ID or the index of the character you want to scroll down to
   */
  let scrollTo = debounce((val) => {
    let selector = typeof val === 'string' ? val : $characters[val].id
    let el = document.querySelector(`#${selector}`).getBoundingClientRect()
    window.scrollBy({top: el.top - (el.height*2), behavior: 'smooth'})
  })

  function handleNewCharacter({id, name, desc, img, imgType}) {
    let idChars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz🧙']
    function randChar() {
      return idChars[ Math.floor( Math.random() * idChars.length ) ]
    }
    function makeID(num = 3) {
      id = ""
      for(let i=num; num>0; num--) { id += randChar() }
      for (let char in $characters) { if (char.id === id) makeID(num) }
    }
    if (typeof id === 'undefined') makeID()
    $characters.push({
      id: id,
      name: name ? name: '',
      desc: desc ? desc : '',
      img: img ? img : null,
      imgType: imgType ? imgType : null
    })
    characters.set($characters) // A cheat to display the new character
    scrollTo(id)
    return {id: id, index: $characters.length-1}
  }

  async function handleImportImages(input) {
    let files = input.target.files
    for (let i in files) {
      if (files[i].name && /image\/*/g.test(files[i].type)) {
        let {index} = handleNewCharacter({
          name: files[i].name.split('.')[0],
          imgType: 'loading'
        })
        try {
          let data = await imageCompress(files[i])
          if (data && data.url && data.type) {
            $characters[index].img = data.url
            $characters[index].imgType = data.type
          } else {
            throw 'FFMpeg has failed.'
          }
        } catch(e) {
          $characters.splice(index, 1)
          characters.set($characters)
        }
      }
    }
  }

  async function handleRemoveCharacter(index) {
    if (index > -1) $characters.splice(index, 1)
    handleOpen(null)
    characters.set($characters)
  }

</script>

<div style="position:relative;" >
  <!-- Controls -->
  <controls class:shadow="{shadow}">

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
      <input type='file' accept='image/*' multiple hidden on:change={handleImportImages}/>
    </label>

  </controls>

  <!-- Characters -->
  <characters>
    {#each $characters as char, index (char.id)}
      <Character 
        {char}
        {opened}
        {index}
        {handleOpen}
        on:duplicate={() => {
          handleNewCharacter({id: null, ...char})
          handleOpen($characters.length-1)
        }}
        on:remove={() => {
          handleRemoveCharacter(index)
        }}
      />
    {/each}
  </characters>
</div>

<style lang='scss'>
  controls {
    display: block;
    position: fixed;
    left: 0;
    top: 3rem;
    right: 0;
    padding: .5rem;
    background: var(--back);
    z-index: 5;
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
  .shadow {
    transition: box-shadow .5s;
    box-shadow: 0 0 1rem rgba(0,0,0,0.5);
  }
  characters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8em, 8em));
    grid-gap: 1rem;
    max-width: 1920px;
    padding-top: 4em;
    margin: auto;
    justify-content: center;
    @media screen and (max-width:500px) {
      grid-template-columns: repeat(auto-fit, minmax(6em, 6em));
    }
  }
</style>