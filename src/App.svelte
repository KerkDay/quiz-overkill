<script>
	// Import External Stuff
	import saveAs from 'file-saver'

	// Import Svelte Stuff
	import {setContext} from 'svelte'

	// Import Components
	import Start from './tabs/Start.svelte'
	import Options from './tabs/Options.svelte'
	import Characters from './tabs/Characters.svelte'
	import Questions from './tabs/Questions.svelte'
	import Nav from './parts/Nav.svelte'

	// Import Stores
	import { optStore, charStore, qStore } from './stores'
	// Send those stores to global contexts, so that children can use these stores without them being passed down.
	setContext('options', optStore)
	setContext('characters', charStore)
	setContext('questions', qStore)

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
			if ( currentTab !== null) {
				saveFile()
			}
		}
	})

	function saveFile() {

		let fileName = $optStore.title.replace(/[^a-z0-9]/gi, '').toLowerCase();

		console.log(fileName)

		let fileData = new Blob(
					[JSON.stringify({
						options: $optStore, 
						characters: $charStore, 
						questions: $qStore
					})],
					{
						type: 'application/json'
					}
				)

		saveAs(fileData, fileName+'.json');
	}

</script>

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