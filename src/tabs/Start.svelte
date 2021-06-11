<script>
  import { fly } from 'svelte/transition' 
  import { quadInOut } from 'svelte/easing'
  import { getContext, setContext } from 'svelte';

  // For Icons
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiFileUpload, mdiFilePlus } from '@mdi/js'; 

  export let setCurrentTab; // Change what the tab is.
  
  let opts = getContext('options')
  let chars = getContext('characters')
  let ques = getContext('questions')

  let loading = false
  let droppingFile = false
  let error



  function handleNewQuiz() {
    setCurrentTab(0)
  }

  // Handles when a user uploads a file
  function handleLoadFile() {
    loading = true
    error = undefined
    let file
    file = document.querySelector('input').files[0]

    loadQuiz(file)
  }

  // Handles when a user drops a file into the page
  function dropHandler(event) {
    event.preventDefault()
    droppingFile = false
    loading = true
    error = undefined
    let file

    if (event.dataTransfer.items && event.dataTransfer.items[0].kind === 'file') {
      file = event.dataTransfer.items[0].getAsFile()
    } else {
      file = event.dataTransfer.files[0]
    }

    loadQuiz(file)
  }

  // Handles when to show the "dropping" cover
  function dragOverHandler(event) {
    event.preventDefault()
    if (!loading) droppingFile = true
  }

  // Runs when a quiz file is available, checks the validity, and moves forward
  function loadQuiz(file) {
    // Check to see if file is JSON
    if (file.type === 'application/json') {

      let reader = new FileReader()
      reader.readAsText(file)

      reader.onload = (ev) => {
        let result = {}

        // Check if file can be parsed
        try {
          result = JSON.parse(ev.target.result)
        } catch (err) {
          error = 'Cannot Read File'
          loading = false
          return
        }

        // Check if valid quiz file
        if (typeof result.characters !== 'undefined'
          && typeof result.questions !== 'undefined'
          && typeof result.options !== 'undefined'
        ) {
          opts.set(result.options)
          chars.set(result.characters)
          ques.set(result.questions)
          setCurrentTab(1)
        }
        else {
          error = 'Cannot Read Quiz File'
          loading = false
          return
        }
      }

    } else {
      error = 'Invalid File'
      loading = false
      return
    }
  }
</script>



<div class='back' out:fly={{y: -window.innerHeight, duration: 1000, opacity: 1, easing: quadInOut}} on:drop={dropHandler} on:dragover={dragOverHandler}>
  <div class='box'>

    <!-- Title/Description -->
    <div class='span-2'>
      <h1>Quiz Overkill</h1>
      <p>A tool to write a more complex and creative personality quiz.</p>
      {#if error}
        <div class='error'>{error}</div>
      {/if}
    </div>

    {#if loading}

      <div class='span-2'>
        <h2 class='loading'>Loading</h2>
      </div>

    {:else}
    
      <!-- New Quiz -->
      <div class='new-quiz' on:click="{() => handleNewQuiz()}" >
        <SvgIcon path={mdiFilePlus} type='mdi' size='2em'/>
        <br />
        New Quiz
      </div>

      <!-- Load Quiz -->
      <label class='load-quiz'>
        <SvgIcon path={mdiFileUpload} type='mdi' size='2em'/>
        <br />
        Load Quiz
        <input type='file' hidden on:change='{() => handleLoadFile()}'/>
      </label>

    {/if}

    {#if droppingFile}
      <div class='drop'>Drop your project here</div>
    {/if}

  </div>
</div>



<style lang='scss'>
  .back {
    position: absolute;
    left: 0; top: 0;
    width: 100vw;
    height: 100vh;
    background: hotpink;
    background-image: var(--back-start); 
    display: grid;
    place-items: center;
    transition: transform 1s;
    z-index: 5;
  }
  .box {
    background: black;
    border-radius: 2em;
    padding: 1em;
    margin: 1ch 1rem;
    display: grid;
    grid-template-columns: 50% 50%;
    box-shadow: .2em .2em 1em rgba(0,0,0,0.25);
  }
  .span-2 {
    grid-column-start: span 2;
  }

  .load-quiz {color: #3f51b5}
  .new-quiz {color: #2e7d32}

  .new-quiz, .load-quiz {
    cursor: pointer;
    margin: 0 2ch;
    padding: 1ch .5rem;
    transition: background-color .2s;
    border-radius: 1em; 
    &:hover {
      background-color: rgba(0,0,0,0.1);
    }
  }

  .error {
    background: rgb(175, 51, 19);
    color: rgb(212, 164, 164);
    border-radius: 1em;
    margin: 1em 2ch;
    padding: .5em 1ch;
  }

  .loading {
    background: rgb(141, 101, 139);
    background-image: linear-gradient(45deg, rgb(141, 101, 139), #000, rgb(141, 101, 139)); 
    background-repeat: no-repeat;
    background-clip: text;
    -webkit-background-clip: text;
    background-position-x: -100%;
    background-size: 10ch 2em;
    color: transparent;
    animation: loadingbg 3s ease infinite;
  }

  @keyframes loadingbg{
    0% { background-position-x: -10ch; }
    100% { background-position-x: 10ch; }
  }

  .drop {
    position: fixed;
    background: rgba(0,0,0,.90);
    color: white;
    z-index: 5;
    left: 0; top: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
  }

  p {
    width: 30ch;
    @media (max-width: 500px) {width: 100%}
  }
</style>