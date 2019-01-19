import React, { Component } from 'react'
import { Button, StyleSheet, View, Text } from 'react-native'

import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas'

export default class example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <SketchCanvas
            ref="canvas"
            style={{
              width: 280,
              height: 280,
              borderColor: 'black',
              marginTop: 30,
              borderWidth: 1
            }}
            strokeColor={'red'}
            strokeWidth={20}
            onStrokeEnd={() => true}
          />
          <Button title="Clear" onPress={() => this.refs.canvas.clear()} />
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
