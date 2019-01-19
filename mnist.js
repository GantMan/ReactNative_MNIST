import {
  NativeModules,
} from 'react-native';

export const getHex = (path, options) => new Promise((resolve, reject) => {
  NativeModules.MNISTPixels.getHex(path, options, (err, color) => {
    if (err) return reject(err);

    resolve(color);
  });
});

export default {
  getHex,
}
