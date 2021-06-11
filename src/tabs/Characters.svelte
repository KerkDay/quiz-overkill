<script>
  import {getContext} from 'svelte'

  import Character from '../parts/characters/Character.svelte'

  let characters = getContext('characters')
</script>

<div>
  <characters>
    {#each $characters as char }
      <Character {char} />
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