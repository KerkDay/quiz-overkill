
	// Import Svelte Stuff
	import {writable} from 'svelte/store'
	// Create the 'Stores' that will act as all the data needed for this SPA
	export const optStore = writable({})
	export const charStore = writable([])
	export const qStore = writable([])