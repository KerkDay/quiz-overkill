import imageCompression from 'browser-image-compression'
import randomColor from 'randomcolor';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: false});

export default async function compressImg(img, size = 300) {
  if (img) {
    /* GIF or Video */
    if (img.type === 'image/gif') {
      try {
        const promise = new Promise((resolve, reject) => {
          const i = new Image()
          i.onload = function() { 
            let ow = this.width, oh = this.height
            let big = Math.max(ow, oh)
            let w = Math.floor(ow * size/big)
            let h = Math.floor(oh * size/big)
            h = h%2 === 0 ? h : h+1
            w = w%2 === 0 ? w : w+1
            resolve({w, h, ow, oh}) 
          }
          i.src = URL.createObjectURL(img)
        })
        let {w, h, oh, ow} = await promise
        let color = randomColor().replace('#', '').toUpperCase();
  
        ffmpeg.isLoaded() ? "" : await ffmpeg.load();
        ffmpeg.FS('writeFile', 'convert.gif', await fetchFile(img))
  
        await ffmpeg.run(
          '-f', 'lavfi',
          '-i', `color=c=0x${color}:s=${ow}x${oh}`,
          '-i', 'convert.gif', 
          '-shortest',
          '-filter_complex', `[0:v][1:v]overlay=shortest=1,scale=${w}:${h}`,
          '-pix_fmt', 'yuv420p', 
          '-crf', '28',
          '-f', 'mp4', 
          'out.mp4'
        )
  
        const data = ffmpeg.FS('readFile', 'out.mp4')
        const blob = new Blob([data.buffer], {type:'video/mp4'})
  
        const url = URL.createObjectURL(blob)

        let results = {
          type: 'video',
          url: url
        }
  
        return results
      } catch(e) {
        return null
      }
    /* Image */
    } else if (/image\/*/g.test(img.type)) {
      try {
        const compressedImg = await imageCompression(img, {
          maxWidthOrHeight: size,
        })
        let buffer = await compressedImg.arrayBuffer()
        let blob = new Blob([buffer], {type: img.type})
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