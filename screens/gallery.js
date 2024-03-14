import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import { useState } from 'react';
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'
import { useUser } from '../global/UserContext';
import { BASE_URL } from '@env';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const imageWidth = (screenWidth * 80) / 100;
const imageHeight = (screenHeight * 20) / 100;

const Gallery = () => {

    const { userData } = useUser();

    const [image, setImage] = useState(null);
    const [desc, setDesc] = useState('')

    // Below is BASE64 one 

    const submitImage = async () => {
        try {
            const imageBase64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
            await axios.post(`${BASE_URL}:8000/upload/image`, {
                "photo": imageBase64,
                "description": desc,
                "image_path": image.toString(),
                "phone_number": userData.phone,
                "first_name": userData.fname,
                "last_name": userData.lname

                }).then(async(res) => {
                console.log(res.status)
                // let res2 = await axios.get('https://flask-app-gamma-livid.vercel.app/api').then(async(res3)=>{
                //     return await res3.data;
                // })
                // console.log(res2)
            })
        } catch (error) {
            console.error(error);
        }
        setImage(null)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        } else {
            alert('You Didn\'t Select Any Image');
        }
    };

    function after() {
        return (
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={40}
            >
                <View style={styles.after}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image2} />
                    </View>
                    <View style={styles.textContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Enter The Description'
                            onChangeText={(text) => { setDesc(text) }}
                        />
                        <TouchableOpacity style={styles.afterButton} onPress={submitImage}>
                            <Text>Send Image</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        )

    }
    function before() {
        return (
            <>
            <View style={{flexDirection:'row', width:'100%', flex:0.04, justifyContent: 'space-around', }}>
            <Image source={require('../assets/Rectangle2.png')} style={{marginLeft: 51.5}} />
            <Image source={require('../assets/Rectangle2.png')} style={{marginRight: 61.5}}/>
            </View>
            <View style={styles.maincontainer}>
            <View>
            <Image source={require('../assets/Rectangle1.png')} style={styles.toprectangle} />
            </View>
            <View style={styles.containerimage}>
                <View>
                <Image source={require('../assets/Rectangle2.png')}/>
                </View>
                <View>
                <Image source={require('../assets/Rectangle2.png')} />
                </View>
            </View>
            
            <View>
                <Image source={require('../assets/Rectangle1.png')} style={styles.rectangle1} />
            </View>
            </View>

            
            <View style={styles.container}>
            <View style={{marginTop: 50,}}>
                <Text style={styles.header}>Snap.</Text>
                <Text style={styles.header}>Diagnose.</Text>
                <Text style={styles.header}>Grow.</Text>
            </View>

            <View style={styles.image}>
                <Image source={require('../assets/gallery.png')}  />
            </View>

            </View>

            <View style={styles.before}>
                <TouchableOpacity style={styles.beforeButton} onPress={pickImage}>
                    {/* <Image source={require('../assets/upload.png')} style={{ width: 100, height: 100 }} /> */}
                    <Text style = {{fontSize: 18,}}>Upload Image</Text>
                </TouchableOpacity>
                <View style = {styles.explanationContainer}>
                <Text style={styles.title}>Upload a clear image of your diseased crop.</Text>

                <Text style={styles.title}>Receive a quick diagnosis or contact an expert.</Text>
                </View>
            </View>
            </>
        )
    }

    return (
        <View style={styles.main}>
            {image && after()}
            {!image && before()}
        </View>
    );
}

export default Gallery

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    before: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 150,
    },
    beforeButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9EC19D',
        maxHeight: 50,
        width: 200,
        borderRadius: 50,
    },
    title: {
        fontSize: 19,
        color: '#444343',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '85%',     
    },

    explanationContainer: {
        marginTop: 15,
    },

    after: {
        flex: 1,
        width: screenWidth,
    },
    afterButton: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7fffd4',
        width: 250,
        borderRadius: 50,
        marginTop: 25
    },
    container: {
        flexDirection: 'row',
        flex: 0.15,

    },  
    maincontainer: {
        flex: 0.2,
    },
    containerimage: {
        flex: 0.75,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',

    },
    image: {
        marginTop: -48, // Adjust the negative margin to push the image up
    },
    image2: {
        flex: 1,
        resizeMode: 'cover',
        borderRadius: 50,
        margin: 10,
        borderWidth: 1,
        borderWidth: 2,
        borderColor: 'green'
    },
    rectangle1: {
        width: 400,
    },
    toprectangle:{
        width: 400,
    },
    header: {
        justifyContent: 'center',
        height: 55,
        color: '#323232',
        fontSize: 45, 
        fontWeight: 'bold',
        width: 220,
    },
    imageContainer: {
        flex: 1.75,
        marginTop: 15,
        alignContent: 'center',
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
    },
    input: {
        textAlign: 'center',
        borderWidth: 1,
        borderWidth: 1,
        padding: 10,
        margin: 25,
        borderRadius: 25,
        height: 0.1 * screenHeight,
        width: 0.8 * screenWidth
    }
})