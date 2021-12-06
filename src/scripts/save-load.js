/**
 * @file Handles the saving and loading of project files.
 * @author Kerk Day
 * @version 0.1.0
 */
import saveAs from 'file-saver'
import JSZip from 'jszip'

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

  let imgFolder = zip.folder('img')

  if (Array.isArray(characters)) {

    for (let x in characters) {
      const charImgResponse = await fetch(characters[x].img)
      const charImgBlob = await charImgResponse.blob()

      const imgData = new File([charImgBlob], `${characters[x].id}.png`);
      const charFileName = characters[x].imgType === "image" 
        ? `${characters[x].id}.png` 
        : `${characters[x].id}.mp4`
      imgFolder.file(charFileName, imgData, {base64: true})
      fileData.characters.push({
        ...characters[x],
        img: `img/${charFileName}`
      })
    }
  }

  zip.file('data.json', JSON.stringify(fileData, null, " "))

  const fullZip = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9
    },
    mimeType: "application/quiz"
  })

  saveAs(fullZip, fileName+'.qo');
  
}

/**
 * Loads a file, and adds the data to the current 
 * @param {File} file 
 * @returns 
 */
async function loadFile(file, options, characters, questions, setCurrentTab) {
  // Check to see if file is quiz file
  try {

    let reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = async (ev) => {

      let zip = new JSZip()
      let content = await zip.loadAsync(ev.target.result, {})

      let config = JSON.parse(await content.file('data.json').async('text'));

      // Check if valid quiz file
      if (typeof config.characters === 'undefined'
        || typeof config.questions === 'undefined'
        || typeof config.options === 'undefined'
      ) {
        error = 'Cannot Read Quiz File'
        loading = false
        return
      }

      for (let x in config.characters) {
        let char = config.characters[x]
        const charImgBlob = await content.file(char.img).async('blob')
        config.characters[x].img = URL.createObjectURL(charImgBlob)
      }

      options.set(config.options)
      questions.set(config.questions)
      characters.set(config.characters)
      setCurrentTab(0)

    }

  } catch (err) {
    error = 'Invalid File'
    loading = false
    return
  }
}

export {saveFile, loadFile}