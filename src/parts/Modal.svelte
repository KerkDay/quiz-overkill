<script>
	import { fade } from 'svelte/transition'
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { 
    mdiArrowLeftCircle, 
    mdiArrowRightCircle
  } from '@mdi/js'

  export let handleOpen, index
</script>

<div class='modal-outer' 
on:click|self={() => handleOpen(null)} 
transition:fade="{{duration: 300}}"
>
  <div class='modal-inner'>
    <slot></slot>
  </div>
  
  <x >&times;</x>

  {#if typeof index === "number"}
    <div class='prev' on:click={handleOpen(index-1)}>
      <SvgIcon path={mdiArrowLeftCircle} type='mdi' size='2em'/>
    </div>
    <div class='next' on:click={handleOpen(index+1)}>
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

.modal-inner {
  display: grid;
  grid-template-columns: auto auto;
  border-radius: 1em;
  transition: all 1s;
  padding: 1em; margin: 2ch;
  grid-gap: 1em;
  @media screen and (max-width: 500px) {grid-template-columns: auto;}
  
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