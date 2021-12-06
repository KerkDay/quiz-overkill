<script>
	import {saveFile} from './scripts/save-load.js'

	// Import Svelte Stuff
	import { getContext } from 'svelte'

	// Import Components
	import Start from './tabs/Start.svelte'
	import Options from './tabs/Options.svelte'
	import Characters from './tabs/Characters.svelte'
	import Questions from './tabs/Questions.svelte'
	import Nav from './parts/Nav.svelte'

	// Import Stores
	import createStores from './scripts/stores'
	createStores()

	// Get Context
	let options = getContext('options')
	let characters = getContext('characters');
  let questions = getContext('questions')

	// The different tabs available
	let tabs = [
		{ title: 'Options', comp: Options },
		{ title: 'Characters', comp: Characters },
		{ title: 'Questions', comp: Questions }
	]

	// What is the current tab?
	let currentTab = null

	const setCurrentTab = (tab) => {
		if (typeof tab === 'number') currentTab = tabs[tab]
		else currentTab = null
	}

	window.onbeforeunload = function() {
		if (currentTab !== null) return 'Unsaved progress may be lost'
		else return
	}

	// Save JSON
	document.addEventListener('keydown', (e) => {
		if ( ( e.ctrlKey || e.metaKey ) && e.key.toLowerCase() === 's' ) {
			e.preventDefault()
			if ( currentTab ) {
				saveFile($options,$characters,$questions)
			}
		}
	})

</script>

<svelte:head>
	<title>{currentTab ? currentTab.title+" - " : ""}Quiz Overkill</title>
</svelte:head>
<main>	
	{#if currentTab === null}
		<Start {setCurrentTab} />
	{:else}
		<Nav {setCurrentTab} {tabs} {currentTab} />
		<svelte:component this={currentTab.comp} />
	{/if}
</main>

<style lang="scss">
	main {
		text-align: center;
		padding: 3.5rem .5rem .5rem;
		min-height: 100vh;
	}

	@media (max-width: 500px) {
	}
</style>