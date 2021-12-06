/**
 * @file Handles the saving and loading of project files.
 * @author Kerk Day
 * @version 0.1.0
 */
import saveAs from 'file-saver'
import JSZip from 'jszip'
import { getContext } from 'svelte'

/**
 * 
 */
async function saveFile(options, characters, questions) {

  let fileName = typeof options.title === "string"
    ? options.title.replaceAll(/[^a-z0-9]/gi, '').toLowerCase()
    : "quiz";
  let fileData = {
    options: options, 
    questions: questions,
    characters: []
  }

  let zip = new JSZip()

  console.log(characters)

  let charsImgFolder = zip.folder('chars')

  if (Array.isArray(characters)) {

    for (let x in characters) {
      const charImgResponse = await fetch(characters[x].img)
      const charImgBlob = await charImgResponse.blob()

      const imgData = new File([charImgBlob], `${characters[x].id}.png`);
      const charFileName = characters[x].imgType === "image" 
        ? `${characters[x].id}.png` 
        : `${characters[x].id}.mp4`
      charsImgFolder.file(charFileName, imgData, {base64: true})
    }
  }

  zip.file('data.json', JSON.stringify(fileData))

  const fullZip = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9
    }
  })

  saveAs(fullZip, fileName+'.qo');
  
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