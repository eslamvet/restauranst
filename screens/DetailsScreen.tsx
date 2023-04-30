import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from '../utils/server'
import { useRoute } from '@react-navigation/native'
import MapView,{Marker} from 'react-native-maps'
import Loader from '../components/Loader'

const DetailsScreen = () => {
    const {params:{id}} = useRoute<any>()
    const [location, setLocation] = useState<any>()

    useEffect(() => {
        axios.get(`businesses/${id}`).then(res => {
            setLocation(res.data)
        }).catch(console.log)
    }, [])
    
  return (
    <SafeAreaView style={{flex:1}}>
      {
        location ? <View style={{flex:1,padding:20}}>
            <View style={{marginBottom:20}}>
                <Text style={{color:'black',fontSize:24,textAlign:'center'}}>{location.alias}</Text>
                <Text style={{color:'black',fontSize:20,textAlign:'center'}}>{location.alias}</Text>
            </View>
            <MapView
                initialRegion={{
                    latitude: location.coordinates.latitude,
                    longitude: location.coordinates.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={{flex:1}}
                scrollEnabled={false}
                rotateEnabled={false}
            >
                <Marker
                    coordinate={location.coordinates}
                />
            </MapView>
            <View style={{paddingTop:20}}>
                <Text style={{color:'black',fontSize:20}}>Addresses</Text>
                <View style={{paddingStart:15}}>
                    {
                        location.location.display_address.map((address:any,index:number)=><Text key={index} style={{color:'#333'}}>{index+1}-{address}</Text>)
                    }
                </View>
            </View>
        </View> : <Loader />
      }
    </SafeAreaView>
  )
}

export default DetailsScreen

const styles = StyleSheet.create({})