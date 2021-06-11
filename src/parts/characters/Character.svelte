<script>
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';



  export let char

  var opened = false

  function toggleOpen() {
    opened = !opened
  }

  const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

</script>

<character class='{opened ? 'opened' : ''}' >

  {#if !opened}
  <div class='thumb' on:click={toggleOpen}
    in:receive="{{key: char.id}}"
    out:send="{{key: char.id}}"
  >
    <!-- Image -->
    <div class='img'>
      <img src='{char.img}' alt='{char.name}'/>
    </div>

    <!-- Desc -->
    <div>
      <strong>{char.name}</strong>
    </div>
  </div>

  {:else}
    <div class='modal-outer' on:click|stopPropagation|self={toggleOpen}>
      <div class='modal-inner'
        in:receive="{{key: char.id}}"
        out:send="{{key: char.id}}"
      >
          <left>
            <!-- Image -->
            <div class='img'>
              <img src='{char.img}' alt='{char.name}'/>
            </div>

            <!-- Desc -->
            <div>
              <strong>{char.name}</strong>
            </div>
          </left>

          <right>
            Right stuff
          </right>
      </div>
      <x>&times;</x>
    </div>

  {/if}
  
</character>

<style lang='scss'>

character { width: 8rem; height: 8.5rem; }

.thumb {
  background: black;
  border-radius: .5rem;
  padding: .5rem;
  img {
    margin: auto;
    width: 7rem;
    height: 7rem;
    object-fit: cover;
    display: block;
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
  background: rgba(0,0,0,0.9);
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
  grid-template-columns: 15rem auto;
  background: black;
  border-radius: 1em;
  pointer-events: visible;
  transition: all 1s;
  padding: 1em;
  margin: 2ch;
  grid-gap: 1em;

  @media screen and (max-width: 500px) {grid-template-columns: auto;}

  img {
    position: relative;
    display: block;
    width: 15rem;
    height: 15rem;
    object-fit: cover;
  }
}

</style>