
	// Import Svelte Stuff
	import {writable} from 'svelte/store'
	// Create the 'Stores' that will act as all the data needed for this SPA

	/* DEFAAULT OPTIONS */
	export const optStore = writable({
		// Main
		title: "Quiz", 
		description: "", 
		welcomeImg: null, 

		// Quiz Options
		qSelection: "ai", // How to select a question // ai, ordered, random
		canGoBack: true, // Can a user go back after answering a question
		canSkip: true, // Can a user skip a question
		tieBreakers: "random", // How to handle tied results // random, show all
		minQuestions: 0, // Minimum amount of questions before showing results
		transition: "fade", // Transition between questions // none, fade, horizontal, vertical

		// Editor Options
		idLength: 2 // length of ID codes.
	})
	export const charStore = writable([])
	export const qStore = writable([])