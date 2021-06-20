import imageCompression from 'browser-image-compression'

export default async function compressImg(img, size = 300) {
  if (img && /image\/*/g.test(img.type)) {

    // Check if gif
    if (img.type === 'image/gif' && img.size < 500000) {
      let fr = new FileReader()
      return new Promise((resolve, reject) => {
        let err = (e) => reject(e)
        fr.onerror = err
        fr.onabort = err
        fr.onload = (e) => {
          resolve(e.target.result)
        }
        fr.readAsDataURL(img)
      })
    } else {
      try {
        const compressedImg = await imageCompression(img, {
          maxWidthOrHeight: 300,
          useWebWorker: true
        })
        return await imageCompression.getDataUrlFromFile(compressedImg)
      } catch (err) { return }
    }
  } else { return }
}