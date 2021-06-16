<script>
  import {getContext} from 'svelte'
  import debounce from 'lodash/debounce'

  import Character from '../parts/characters/Character.svelte'

  let characters = getContext('characters')

  let opened = null

  let handleOpen = debounce((val) => { 
    if (val >= $characters.length) val = 0
    else if (val < 0) val = $characters.length - 1
    
    console.log(`Opened: ${opened}`)
    console.log(`Val: ${val}`)
    console.log(`Character: ${$characters[val]}`)


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
</script>

<div>
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