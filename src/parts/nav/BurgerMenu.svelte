<script>
    import SvgIcon from "@jamescoyle/svelte-icon"
    import { mdiDotsHorizontal, mdiContentSave, mdiFileUpload, mdiExitRun } from '@mdi/js'
    import { loadFile, saveFile, exitFile } from '../../scripts/save-load'
    import { getContext } from 'svelte'

    export let setCurrentTab, toggleNav

    // Get Context
    let options = getContext('options')
	let characters = getContext('characters')
  	let questions = getContext('questions')


    function handleLoadFile(target) {
        let file = target.files[0]
        loadFile(file, options, characters, questions, setCurrentTab)
        closeNav()
    }

    function closeNav() {
        document.activeElement.blur()
        toggleNav()
    }

</script>

<outer tabindex="0">
    <icon>
        <SvgIcon 
            path={mdiDotsHorizontal} 
            type='mdi' 
            size='1.5em'
        />
    </icon>
    
    <burgerMenu>
        <menuItem
            on:click={() => {
                saveFile($options, $characters, $questions)
                closeNav()
            }}
        >
            <SvgIcon path={mdiContentSave} type="mdi" size='1rem'/>
            Save
        </menuItem>

        <label class="menuItem"
        >
            <SvgIcon path={mdiFileUpload} type="mdi" size='1rem'/>
            Load
            <input type='file' accept='.qo' hidden on:change={(e) => {
                handleLoadFile(e.target)
            }}/>
        </label>

        <menuItem
            on:click={() => {
                exitFile(options, characters, questions, setCurrentTab)
                closeNav()
            }}
        >
            <SvgIcon path={mdiExitRun} type="mdi" size='1rem'/>
            Exit
        </menuItem>
    </burgerMenu>
</outer>

<style lang="scss">
outer {
    position: relative;
    z-index: 10;

    &:focus burgerMenu {
        display: block;
    }
}

icon {
    color: var(--grey);
    &:hover, &:focus {
        color: var(--white);
    }

}

burgerMenu {
    display: none;
    position: fixed;
    right: 0;
    top: 3rem;
    background: black;
    min-height: 5px;
    min-width: 5rem;
}

menuItem, .menuItem {
    font-size: 1.25rem;
    display: grid;
    grid-template-columns: 1rem auto;
    grid-column-gap: .5ch;
    align-items: center;
    justify-items: left;
    width: 100%;
    color: var(--grey);
    padding: .5rem;
    &:hover {
        color: var(--white);
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
    }
}

@media screen and (max-width: $phone-max) {
    icon {
        display: none;
    }

    burgerMenu {
        display: block;
        position: relative;
    }

    .menuItem, menuItem {
        justify-items: center;
        margin: auto;
        width: min-content;
    }
}

</style>