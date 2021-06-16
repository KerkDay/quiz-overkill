<script>

let error = null

onMount(()=>{
  setTimeout(()=> {
    error = null
  }, 5000)
})

</script>

{#if error}
  <div class='error'>{$error}</div>
{/if}

<style>
.error {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  font-size: .75rem;
  background: var(--red);
  color: var(--white);
  padding: .5em;
  opacity: .75;
}
</style>