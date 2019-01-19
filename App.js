import React, { Component } from 'react'
import { Button, StyleSheet, View, Text, Image } from 'react-native'
import { getHex } from './mnist'
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas'
const modelJSON = require('./trained-model')
const brain = require('brain.js')
let net = new brain.NeuralNetwork()
net.fromJSON(modelJSON)

export default class example extends Component {
  state = {
    detectedDigit: null,
    drawnImage: 'data:image/jpg;base64,'
  }
  maxScore(obj) {
    let maxKey = 0
    let maxValue = 0

    Object.entries(obj).forEach(entry => {
      const value = entry[1]
      if (value > maxValue) {
        maxValue = value
        maxKey = parseInt(entry[0], 10)
      }
    })

    return maxKey
  }

  grabPixels = () => {
    this.canvas.getBase64('jpg', false, true, false, false, (err, result) => {
      const resultImage = `data:image/jpg;base64,${result}`
      this.setState({ drawnImage: resultImage })
      getHex(resultImage)
        .then(values => {
          // console.log(values)
          const detection = net.run(values)
          this.setState({ detectedDigit: this.maxScore(detection) })
        })
        .catch(console.error)
    })
  }

  clear = () => {
    this.canvas.clear()
    this.setState({ detectedDigit: null, drawnImage: 'data:image/jpg;base64,' })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <SketchCanvas
            ref={ref => (this.canvas = ref)}
            style={{
              width: 280,
              height: 280,
              borderColor: 'black',
              marginTop: 30,
              borderWidth: 1
            }}
            strokeColor={'#FF0000'}
            strokeWidth={50}
            onStrokeEnd={this.grabPixels}
          />
          <Button title="Clear" onPress={this.clear} />
          <View style={styles.rows}>
            <Text>28x28 version the computer sees =</Text>
            <Image
              style={styles.previewImage}
              source={{ uri: this.state.drawnImage }}
            />
          </View>
          <Text style={styles.resultSentence}>
            {this.state.detectedDigit && `Drawing detected number`}
          </Text>
          <Text style={styles.resultNumber}>
            {this.state.detectedDigit && `${this.state.detectedDigit}`}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  previewImage: {
    width: 28,
    height: 28
  },
  rows: {
    flexDirection: 'row'
  },
  resultSentence: {
    textAlign: 'center',
    fontSize: 24
  },
  resultNumber: {
    textAlign: 'center',
    fontSize: 128
  }
})
