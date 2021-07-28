<script>
  import {getContext, onMount} from 'svelte'
  import {fly} from 'svelte/transition'
  import imageCompress from '../scripts/imageCompress'
  import SvgIcon from '@jamescoyle/svelte-icon'
  import { mdiImageRemove, mdiImagePlus, mdiRobot } from '@mdi/js'
  import Img from '../parts/Img.svelte'
  
  let options = getContext('options')
  let questions = getContext('questions')
  let numQuestions = $questions.length

  onMount(() => {
    questions = null
  })

  async function handleWelcomeImg(e) {
    let data = await imageCompress(e.target.files[0])
    if (data) {
      $options.welcomeImg = data.url
      $options.welcomeImgType = data.type
    }
  }
</script>

<!-- Quiz Info -->
<sect transition:fly >
  <!-- TITLE -->
  <label>
    <optname>Title:</optname>
    <input type='text' placeholder='The name of your quiz' maxlength='30' bind:value={$options.title}/>
  </label>

  <!-- Description -->
  <label>
    <optname>Description:</optname>
    <textarea type='text' placeholder='What users will see when they first view your quiz.' maxlength='300' rows='5' bind:value={$options.description}/>
  </label>

  <!-- Welcome Img -->
  <label>
    <optname>Welcome Image:</optname>
    <Img img={$options.welcomeImg} 
      alt="Welcome Image" icon={mdiImageRemove} 
      pos="welcome" imgType={$options.welcomeImgType} />
    <input type='file' hidden accept='image/*' on:change={handleWelcomeImg} />
  </label>


  <!-- Image Controls -->
  <controls>
    <!-- Upload Image -->
    <label style='color: var(--green);text-align:center;' tabindex='0'>
      <SvgIcon path={mdiImagePlus} type='mdi' size='1em'/>
      <span style='margin-left:.5ch'>Upload Image</span>
      <input type='file' hidden accept='image/*' on:change={handleWelcomeImg} />
    </label>

    <!-- Remove Image -->
    <div style='color: var(--red);text-align:center;' class='control' on:click={()=>{$options.welcomeImg = null}} tabindex='0'>
      <SvgIcon path={mdiImageRemove} type='mdi' size='1em'/>
      <span style='margin-left:.5ch'>Remove Image</span>
    </div>
  </controls>


</sect>

<sect transition:fly>
  <!-- Question Selection -->
  <label>
    <optname>
      Question Selection:
      <description>
        How will questions be queued
      </description>
    </optname>
    <select bind:value={$options.qSelection}>
      <option value='ai' selected> AI Decided </option>
      <option value='ordered'>In Order</option>
      <option value='random'>Random</option>
    </select>
  </label>

  <!-- Can Go Back -->
  <label>
    <input type='checkbox' bind:checked={$options.canGoBack}>
    Can user go back
  </label>

  <!-- Can Skip -->
  <label>
    <input type='checkbox' bind:checked={$options.canSkip}>
    Can user skip questions
  </label>

  <!-- Tiebreaker -->
  <label>
    <optname>
      Tiebreaker:
      <description>
        How to choose a winner when characters are tied
      </description>
    </optname>
    <select bind:value={$options.tieBreaker}>
      <option value='random' selected>Random</option>
      <option value='showall'>Show All Results</option>
    </select>
  </label>

  <!-- Min Questions -->
  <label>
    <optname>
      Minimum Questions:
    </optname>
    <input type='number' min='0' max={numQuestions} bind:value={$options.minQuestions}/>
  </label>

  <!-- Tiebreaker -->
  <label>
    <optname>
      Transition Animation:
    </optname>
    <select bind:value={$options.transition}>
      <option value='none' selected>None</option>
      <option value='fade'>Fade</option>
      <option value='horizontal'>Horizontal</option>
      <option value='vertical'>Vertical</option>
    </select>
  </label>

</sect>

<style lang='scss'>
  sect {
    display: block;
    width: var(--ideal-width);
    margin: 0 auto 1em;
    background: black;
    padding: 1rem;
    border-radius: 1rem;
    text-align: left;
  }
  label, .control {
    display: flex;
    flex-direction: row;
    padding: .5em 1ch;
    margin: .5em 0;
    border-radius: .25rem;
    justify-content: left;
    align-items: flex-start;
    &:hover, &:focus-within { background: var(--black); }
  }
  .control { 
    cursor: pointer;
  }
  controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  optname {
    margin-right: 1ch;
    font-weight: 300;
    color: var(--white);
    text-align: right;
  }
  input:not([type='checkbox'], [type='radio']), textarea, select {
    border: none;
    background: none;
    flex-grow: 1;
    font-family: var(--font);
    color: var(--white);
    font-size: 1rem;
    &::placeholder { color: var(--grey) }
    &:focus { outline: none; }
  }
  select {
    background: var(--black);
  }
  description {
    display: block;
    color: var(--grey);
    max-width: 15ch;
  }
  input[type='checkbox'] {
    margin-right: 1ch;
  }


</style>