import { StyleSheet, ActivityIndicator, View } from 'react-native'
import React from 'react'

export default function Loader() {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator color={'#333'} />
    </View>
  )
}

const styles = StyleSheet.create({})