<script>

  export let setCurrentTab, tabs, currentTab

</script>

<nav>

  <!-- LOGO -->
  <div></div>

  <!-- TABS -->
  <div id='tabs'>
    {#each tabs as tab, index}
      <div class='tab' on:click={setCurrentTab(index)}>
        <div class={`${currentTab == index ? 'current-tab' : 'title'}`} >
          {tab.title}
        </div>
      </div>
    {/each}
  </div>

  <!-- EXTRAS -->
  <div></div>

  <!-- BURGER -->

</nav>

<style lang='scss'>
  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    position: fixed;
    height: 3rem;
    padding: .5rem;
    font-size: 2rem;
    left: 0; top: 0; right: 0;
    background: black;
  }
  #tabs {
    display: flex;
    flex-direction: row;
  }
  .tab {
    margin: 0 2ch;
  }
  .current-tab {
    font-weight: bold;
  }
</style>