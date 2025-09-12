import { HandCoins } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native'
import React from 'react'

const Overlay = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#379683' }}>
      <HandCoins size={100} color="white" />
    </View>
  )
}

export default Overlay

const styles = StyleSheet.create({})