<script>

	// Import Svelte Stuff
	import {setContext} from 'svelte'

	// Import Components
	import Start from './tabs/Start.svelte'
	import Options from './tabs/Options.svelte'
	import Characters from './tabs/Characters.svelte'
	import Questions from './tabs/Questions.svelte'

	// Import Stores
	import { optStore, charStore, qStore } from './stores.js'
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

	const setCurrentTab = (num) => {
		if (typeof num === 'number') currentTab = tabs[num]
		else currentTab = null
	}

	window.onbeforeunload = function() {
		if (currentTab !== null) return 'Unsaved progress may be lost'
		else return
	}

</script>

<main>

	{#if currentTab === null}
		<Start {setCurrentTab} />
	{:else}
		<h1>{currentTab.title}</h1>
		<svelte:component this={currentTab.comp} />
	{/if}
</main>

<style lang="sass">
	main
		text-align: center
		padding: 1em
		margin: 0 auto
		box-sizing: border-box
		max-width: 100vw

	@media (max-width: 640px) 
		main 
			max-width: none
			padding: 1ch
</style>