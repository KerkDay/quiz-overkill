import imageCompression from 'browser-image-compression'

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

export default async function compressImg(img, size = 300) {
  if (img) {
    /* GIF or Video */
    if (img.type === 'image/gif') {
      ffmpeg.isLoaded() ? "" : await ffmpeg.load();
      ffmpeg.FS('writeFile', 'convert.gif', await fetchFile(img))

      await ffmpeg.run(
        '-i', 'convert.gif', 
        '-vf', `scale='min(${size},iw)':'min(${size},ih)'`, 
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
        let url = await imageCompression.getDataUrlFromFile(compressedImg)

        let results = {
          type: 'image',
          url: url
        }
  
        return results
      } catch (err) { return }
    } else { return }
  } else { return }
}