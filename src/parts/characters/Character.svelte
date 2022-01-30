<script>
  import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition'
  import Img from '../Img.svelte'

  // Imported Stuff
  export let char, index
  
	const dispatch = createEventDispatcher();
</script>



<character id={`char-${char.id}`}>
  <div class='thumb' on:click={dispatch('open', index)} transition:fade="{{duration: 300}}">
    <Img img={char.img} alt={char.id} imgType={char.imgType} pos="thumb"/>
    <div>
      {#if char.name}
        <strong>{char.name}</strong>
      {:else}
        <strong style='color:var(--grey)'>Nobody</strong>
      {/if}
    </div>
  </div>
</character>



<style lang='scss'>

character { display: block; }

.thumb {
  background: black;
  border-radius: .5rem;
  padding: .5rem;
  @media screen and (max-width: $phone-max) {
    border-radius: .25rem; padding: .25rem;
  }
}



</style>