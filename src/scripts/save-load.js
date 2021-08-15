/**
 * @file Handles the saving and loading of project files.
 * @author Kerk Day
 * @version 0.1.0
 */
import saveAs from 'file-saver'
import {} from 'fflate'

/**
 * 
 */
async function saveFile() {
  let fileName = $optStore.title.replaceAll(/[^a-z0-9]/gi, '').toLowerCase();

  let fileData = new Blob(
    [JSON.stringify({
      options: $optStore, 
      characters: $charStore, 
      questions: $qStore
    })],
    { type: 'application/json' }
  )

  saveAs(fileData, fileName+'.json');
  
}

/**
 * Loads a file, and adds the data to the current 
 * @param {File} file 
 * @returns 
 */
async function loadFile(file) {
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

export {saveFile, loadFile}