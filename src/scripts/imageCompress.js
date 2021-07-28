import imageCompression from 'browser-image-compression'

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

export default async function compressImg(img, size = 300) {
  if (img) {
    /* GIF or Video */
    if (img.type === 'image/gif') {

      const promise = new Promise((resolve, reject) => {
        const i = new Image()
        i.onload = function() { 
          let w = this.width, h = this.height
          let big = Math.max(w, h)
          w = Math.floor(w * size/big)
          h = Math.floor(h * size/big)

          h = h%2 === 0 ? h : h+1
          w = w%2 === 0 ? w : w+1

          resolve({w, h}) 
        }
        i.src = URL.createObjectURL(img)
      })
      let {w, h} = await promise
      console.log(`[GIF Image Size] ${w} x ${h}`)

      ffmpeg.isLoaded() ? "" : await ffmpeg.load();
      ffmpeg.FS('writeFile', 'convert.gif', await fetchFile(img))

      await ffmpeg.run(
        '-i', 'convert.gif', 
        '-vf', `scale=${w}:${h}`, 
        '-pix_fmt', 'yuv420p', 
        '-f', 'mp4', 
        'out.mp4'
      )

      const data = ffmpeg.FS('readFile', 'out.mp4')

      const url = URL.createObjectURL(new Blob([data.buffer], {type:'video/mp4'}))
      
      let results = {
        type: 'video',
        url: url
      }

      return results

    /* Image */
    } else if (/image\/*/g.test(img.type)) {
      try {
        const compressedImg = await imageCompression(img, {
          maxWidthOrHeight: size,
          useWebWorker: true
        })
        let buffer = await compressedImg.arrayBuffer()
        let url = URL.createObjectURL(new Blob([buffer], {type: img.type}))

        let results = {
          type: 'image',
          url: url
        }
  
        return results
      } catch (err) { return }
    } else { return }
  } else { return }
}