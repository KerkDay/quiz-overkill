<script>
	import { fade } from 'svelte/transition'
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { createEventDispatcher } from 'svelte';
  import { mdiArrowLeftCircle, mdiArrowRightCircle } from '@mdi/js'

  export let arrows = false

  const dispatch = createEventDispatcher();

  // Exit Modal when escape key is pressed.
  document.addEventListener('keydown', (e) => {
    // Escape key leaves the modal
		if ( e.key === "Escape" ) {
			e.preventDefault()
			dispatch('open', {goto: null})
    }

    // Arrow Keys move forward and back
    if ( !["INPUT", "TEXTAREA"].includes(document?.activeElement?.tagName) ) {
      if ( e.key === 'ArrowLeft' ) {
        dispatch('open', {moveBy: -1})
      } else if ( e.key === 'ArrowRight') {
        dispatch('open', {moveBy: 1})
      }
    }
    
	})

</script>

<div class='modal-outer' 
  on:click|self={() => {dispatch('open', null)}} 
  transition:fade
>
  <div class='modal-inner'>
    <slot></slot>
  </div>
  
  <x>&times;</x>

  {#if arrows}
    <div class='prev' on:click={() => {dispatch('open', {moveBy: -1})}}>
      <SvgIcon path={mdiArrowLeftCircle} type='mdi' size='2em'/>
    </div>
    <div class='next' on:click={() => {dispatch('open', {moveBy: 1})}}>
      <SvgIcon path={mdiArrowRightCircle} type='mdi' size='2em'/>
    </div>
  {/if}
</div>

<style lang="scss">
@mixin inset { left: 0; right: 0; top: 0; bottom: 0; }
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

.prev, .next {
  display: block;
  position: fixed;
  color: var(--white);
  &:hover {color: var(--grey);}
  top: 50%;
  @media screen and (max-width: $phone-max) {
    top: unset;
    bottom: 1em;
  }
}
.prev {left: 1em;}
.next {right: 1em;}
</style>