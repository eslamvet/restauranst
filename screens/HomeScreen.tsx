import { FlatList, ImageBackground, Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState,useDeferredValue, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from '../utils/server'
import { useNavigation } from '@react-navigation/native'
import Loader from '../components/Loader'

const HomeScreen = () => {
    const [sections, setSections] = useState<any>(null)
    const [numColumns, setNumColumns] = useState(1)
    const [searchText, setSearchText] = useState('')
    const  searchTextDeferredValue =  useDeferredValue(searchText)
    const sectionsRef = useRef<any>()
    const navigation = useNavigation<any>()
    
    useEffect(() => {
        axios.get('businesses/search', {
            params: {
                'location': 'san jose',
                'limit': 50
            }
        }).then(res => {
            const sections = res.data.businesses.reduce((acc: any, el: any) => {
                switch (el.price) {
                    case '$':
                        acc[0].data.push(el)
                        break;
                    case '$$':
                        acc[1].data.push(el)
                        break;
                    case '$$$':
                        acc[2].data.push(el)
                        break;
                }
                return acc
            }, [{ title: 'Cost Effective', data: [] }, { title: 'Bit Pricer', data: [] }, { title: 'Bi Spender', data: [] }])
            // console.log(sections[0].data);
            sectionsRef.current = sections
            setSections(sections)
        }).catch(console.log)
    }, [])

    useEffect(() => {
        if(sectionsRef.current){
            if(searchTextDeferredValue !== ''){
                setSections(sectionsRef.current.map((section:any)=>({...section,data:section.data.filter((el:any)=>el.name.toLowerCase().includes(searchTextDeferredValue.toLowerCase()))})))
            }else setSections(sectionsRef.current)
        }
    }, [searchTextDeferredValue])
    
    const keyExtractor = (item: any) => item.id

    const renderItem = ({ item , index}: any) => (
        <TouchableOpacity style={[{width:numColumns == 1 ? '100%' : '49%'},numColumns == 2 && index % 2 == 0 && {marginEnd:'2%'}]} onPress={()=>navigation.navigate('Details',{id:item.id})}>
            <ImageBackground source={{ uri: item.image_url }} resizeMode='cover' style={{ height: 200 , alignItems:'center' , justifyContent: 'center'}}>
                <Text>{item.name}</Text>
                <Text>{item.rating}</Text>
            </ImageBackground>
        </TouchableOpacity>
    )

    const ItemSeparatorComponent = () => <View style={{ height: 20 }} />

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                sections ?
                    <ScrollView style={{ flex: 1 }}>
                        <ScrollView style={{ flex: 1 }} horizontal contentContainerStyle={{ flex: 1, paddingHorizontal: 20 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{marginVertical:20}}>
                                    <TextInput value={searchText} onChangeText={setSearchText} style={{height: 50,borderWidth:1,paddingHorizontal:15,color:'#333'}} />
                                </View>
                                {
                                    sections.map((item: any, index: number) => (
                                        <View key={index}>
                                            <View style={{ flexDirection:'row',justifyContent:'space-between'}}>
                                                <Text style={{ color: '#222', fontSize: 24 }}>{item.title}</Text>
                                                {index == 0 && <Pressable onPress={() =>setNumColumns(prev=> prev == 1 ? 2 : 1)}><Text style={{ color: '#222', fontSize: 24 }}>{numColumns == 1 ? 'column' : 'row'}</Text></Pressable>}
                                            </View>
                                            <FlatList
                                                data={item.data}
                                                key={numColumns}
                                                numColumns={numColumns}
                                                nestedScrollEnabled
                                                ItemSeparatorComponent={ItemSeparatorComponent}
                                                keyExtractor={keyExtractor}
                                                renderItem={renderItem}
                                                ListEmptyComponent={<Text style={{color:'black',textAlign:'center'}}>no data found</Text>}
                                            />
                                        </View>
                                    ))
                                }
                            </View>
                        </ScrollView>
                    </ScrollView> : <Loader />
            }
        </SafeAreaView>
    )
}

export default HomeScreen

