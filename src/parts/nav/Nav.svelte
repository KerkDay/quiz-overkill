<script>
  import {slide} from 'svelte/transition'
  import { mdiMenu } from '@mdi/js'
  import SvgIcon from '@jamescoyle/svelte-icon'
  import BurgerMenu from './BurgerMenu.svelte'

  export let setCurrentTab, tabs, currentTab

  let navOpened = false, shadow = false

  if (window.innerWidth > 500) navOpened = true

  let handleClickTab = (e) => {
    if (window.innerWidth <= 500) toggleNav()
    setCurrentTab(e)
  }

  let toggleNav = () => {
    navOpened = !navOpened
  }

  document.addEventListener('scroll', () => {
    shadow = window.scrollY > 0
  })

</script>

<!-- BURGER MENU -->
<div id='nav-mobile' on:click={toggleNav}>
  <SvgIcon path={mdiMenu} type='mdi' size='1em' color='var(--white)'/>
</div>

{#if navOpened}
  <nav transition:slide class={shadow ? 'nav-shadow' : ''}>

    <!-- LOGO -->
    <div>
    </div>

    <!-- TABS -->
    <div id='nav-tabs'>
      {#each tabs as tab, index}
        <div class='tab' on:click={() => handleClickTab(index)} tab-index='0'>
          <div class={`${currentTab == tab ? 'current-tab' : 'title'}`} >
            {tab.title}
          </div>
        </div>
      {/each}
    </div>

    <!-- EXTRAS -->
    <div>
      <BurgerMenu {setCurrentTab} {toggleNav}/>
    </div>

  </nav>
{/if}

<style lang='scss'>

  @mixin top-bar {
    position: fixed;
    padding: .5rem;
    font-size: 1.5rem;
    height: 3rem;
    left: 0; top: 0; right: 0;
    background: black;
    z-index: 5;
  }
  nav {
    @include top-bar;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-shadow: none;
    transition: box-shadow .5s;
    z-index: 10;
  }
  #nav-tabs {
    display: flex;
    flex-direction: row;
  }
  .tab {
    margin: 0 2ch;
    cursor: pointer;
    color: var(--grey);
  }
  .current-tab {
    font-weight: bold;
    color: var(--white);
  }

  #nav-mobile {
    display: none;
    border: none;
    width: 100vw;
    text-align: right;
    @include top-bar;
  }

  .nav-shadow {
    box-shadow: 0 0 1rem rgba(0,0,0,0.5);
  }

  @media screen and (max-width: $phone-max) {
    #nav-mobile {
      display: block;
    }
    nav {
      display: block;
      top: 3rem;
      flex-direction: column;
      height: unset;
      bottom: 0;
      z-index: 10;
      #nav-tabs {
        flex-direction: column;
      }
      .tab {
        margin: 1rem;
      }
    }
  }
</style>