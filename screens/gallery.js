import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';

import axios from 'axios';
import { useUser } from '../global/UserContext';
import { BASE_URL } from '@env';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Gallery = () => {
    const { userData } = useUser();

    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return null;
        }
        const userLocation = await Location.getCurrentPositionAsync({});
        return userLocation;
    };

    const submitImage = async () => {
        try {
            const imageBase64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
            const locationObject = await getLocation();
            if (!locationObject) {
                alert('Location is not available');
                return;
            }
            await axios.post(`${BASE_URL}/upload/image`, {
                "photo": imageBase64,
                "phone_number": userData.phone,
                "first_name": userData.fname,
                "last_name": userData.lname,
                "location": locationObject.coords.latitude + ',' + locationObject.coords.longitude,
            }).then(async (res) => {
                console.log(res.status);
                if (res.status === 200) {
                    setImage(null);
                    setModalVisible(true);
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera and location permissions to make this work!');
            return;
        }
        const locationStatus = await Location.requestForegroundPermissionsAsync();
        if (locationStatus.status !== 'granted') {
            alert('Sorry, we need location permissions to make this work!');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            try {
                const compressedImage = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 800 } }],
                    { compress: 0.7, base64: false }
                );
                const imageBase64 = await FileSystem.readAsStringAsync(compressedImage.uri, { encoding: 'base64' });
                const locationObject = await getLocation();
                if (!locationObject) {
                    alert('Location is not available');
                    return;
                }
                const response = await axios.post(`${BASE_URL}/upload/image`, {
                    "photo": imageBase64,
                    "phone_number": userData.phone,
                    "first_name": userData.fname,
                    "last_name": userData.lname,
                    "location": locationObject.coords.latitude + ',' + locationObject.coords.longitude,
                });
                console.log(response.status);
                if (response.status === 200) {
                    setImage(null);
                    setModalVisible(true);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('You did not take a photo');
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
        });

        if (!result.canceled) {
            try {
                const compressedImage = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 800 } }],
                    { compress: 0.7, base64: false }
                );
                const imageBase64 = await FileSystem.readAsStringAsync(compressedImage.uri, { encoding: 'base64' });
                const locationObject = await getLocation();
                if (!locationObject) {
                    alert('Location is not available');
                    return;
                }
                const response = await axios.post(`${BASE_URL}/upload/image`, {
                    "photo": imageBase64,
                    "phone_number": userData.phone,
                    "first_name": userData.fname,
                    "last_name": userData.lname,
                    "location": locationObject.coords.latitude + ',' + locationObject.coords.longitude,
                });
                console.log(response.status);
                if (response.status === 200) {
                    setImage(null);
                    setModalVisible(true);
                }
            } catch (error) {
                console.error(error);
            }
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
                <View style={{ flexDirection: 'row', width: '100%', flex: 0.04, justifyContent: 'space-around', }}>
                    <Image source={require('../assets/Rectangle2.png')} style={{ marginLeft: 51.5 }} />
                    <Image source={require('../assets/Rectangle2.png')} style={{ marginRight: 61.5 }} />
                </View>
                <View style={styles.maincontainer}>
                    <View>
                        <Image source={require('../assets/Rectangle1.png')} style={styles.toprectangle} />
                    </View>
                    <View style={styles.containerimage}>
                        <View>
                            <Image source={require('../assets/Rectangle2.png')} />
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
                    <View style={{ marginTop: 50, }}>
                        <Text style={styles.header}>Snap.</Text>
                        <Text style={styles.header}>Diagnose.</Text>
                        <Text style={styles.header}>Grow.</Text>
                    </View>

                    <View style={styles.image}>
                        <Image source={require('../assets/gallery.png')} />
                    </View>
                </View>

                <View style={styles.before}>
                    <TouchableOpacity style={styles.beforeButton} onPress={takePhoto}>
                        <Text style={{ fontSize: 18, }}>Click A Picture</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.beforeButton} onPress={pickImage}>
                        <Text style={{ fontSize: 18, }}>Upload Image</Text>
                    </TouchableOpacity>
                    <View style={styles.explanationContainer}>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Your image has been sent for processing. Please check the history after 1-2 minutes.</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 10,
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
        marginTop: -48,
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
    toprectangle: {
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
        padding: 10,
        margin: 25,
        borderRadius: 25,
        height: 0.1 * screenHeight,
        width: 0.8 * screenWidth
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});