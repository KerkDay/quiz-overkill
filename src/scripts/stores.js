import {writable} from 'svelte/store'
import {setContext} from 'svelte'
import constants from './constants'

export default function createStores() {
	const optStore = writable({...constants.DEFAULT_OPTIONS})
	const charStore = writable([...constants.DEFAULT_CHARACTERS])
	const qStore = writable([...constants.DEFAULT_QUESTIONS])
	setContext('options', optStore)
	setContext('characters', charStore)
	setContext('questions', qStore)
}
