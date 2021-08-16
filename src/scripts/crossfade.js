import { quintOut } from 'svelte/easing'
import { crossfade } from 'svelte/transition'
import debounce from 'lodash/debounce'

const [send, receive] = crossfade({ duration: 400, easing: quintOut })

export {send, receive};