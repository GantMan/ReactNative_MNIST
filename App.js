import React, { Component } from 'react'
import { Button, StyleSheet, View, Text } from 'react-native'
import { getHex } from './mnist'
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas'
const modelJSON = require('./trained-model')
const brain = require('brain.js')
let net = new brain.NeuralNetwork()
net.fromJSON(modelJSON)

export default class example extends Component {
  state={
    detectedDigit: null
  }
  maxScore(obj) {
    let maxKey = 0;
    let maxValue = 0;

    Object.entries(obj).forEach(entry => {
      const value = entry[1];
      if (value > maxValue) {
        maxValue = value;
        maxKey = parseInt(entry[0], 10);
      }
    });

    return maxKey;
  }

  grabPixels = () => {
    this.canvas.getBase64('jpg', false, true, false, false, (err, result) => {
      getHex(`data:image/jpg;base64,${result}`)
        .then(color => {
          // console.log(color)
          const detection = net.run(color);
          this.setState({detectedDigit: this.maxScore(detection)})
          // alert(this.maxScore(detection));
        })
        .catch(console.error)
    })
  }

  clear = () => {
    this.canvas.clear()
    this.setState({detectedDigit: null})
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
          <Text>
            {this.state.detectedDigit && `Drawing detected as ${this.state.detectedDigit}`}
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
  }
})
