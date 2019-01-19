import { NativeModules } from 'react-native'

export const getPixels = path =>
  new Promise((resolve, reject) => {
    NativeModules.MNISTPixels.getPixels(path, (err, color) => {
      if (err) return reject(err)

      resolve(color)
    })
  })

export default {
  getPixels
}
