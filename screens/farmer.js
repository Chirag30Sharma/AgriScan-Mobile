import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions } from 'react-native';
import axios from 'axios'
import { BlurView } from 'expo-blur';
import { useUser } from '../global/UserContext';
import { BASE_URL } from '@env';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Farmer = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [disabledButtons, setDisabledButtons] = useState({});

    const { userData } = useUser();

    handlePost = async () => {
        await axios.post(`${BASE_URL}/user/chat`, {
            phone_number: userData.phone,
            first_name: userData.fname,
            last_name: userData.lname,
            title: title,
            description: description
        })
        setIsModalVisible(false)
    }

    const fetchData = () => {
        axios
            .get(`${BASE_URL}/user/chat`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(true);
            });
    };

    // Update your handleLike and handleDislike functions
    const handleLike = async (chatid) => {
        if (!disabledButtons[chatid]) {
            try {
                await axios.post(`${BASE_URL}/user/chat/${chatid}/like`);
                setDisabledButtons(prevState => ({ ...prevState, [chatid]: true }));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDislike = async (chatid) => {
        if (!disabledButtons[chatid]) {
            try {
                await axios.post(`${BASE_URL}/user/chat/${chatid}/dislike`);
                setDisabledButtons(prevState => ({ ...prevState, [chatid]: true }));
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            fetchData();
        }, 3000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <View style={styles.main}>
            {loading ? (
                <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
            ) : (
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Local Discussion</Text>
                    <View style={styles.divider} />
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()} // Use the index as key
                        style={styles.list}
                        renderItem={({ item, index }) => (
                            <View style={styles.card} key = {index.toString()}>
                                {/* style={{ textAlign: 'center' }} */}
                                <Text style={{ textAlign: 'center' }}>{item.first_name} {item.last_name}</Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
                                <Text style={{ textAlign: 'center' }}>______________________________</Text>
                                <Text style={{ paddingTop: 15 }}>{item.description}</Text>
                                <Text style={{ marginTop:20 }}>
                                <TouchableOpacity onPress={() => handleLike(item.chat_id)} disabled={disabledButtons[item.chat_id]}>
                                    <MaterialCommunityIcons name="thumb-up-outline" size={30} color="green" />
                                </TouchableOpacity>
                                <Text style={styles.likeDislikeText}>{item.liked}</Text>
                                <TouchableOpacity onPress={() => handleDislike(item.chat_id)} disabled={disabledButtons[item.chat_id]}>
                                    <MaterialCommunityIcons name="thumb-down-outline" size={30} color="red" />
                                </TouchableOpacity>
                                <Text style={styles.likeDislikeText}>{item.dislike}</Text>
                                </Text>
                            </View>
                        )}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setIsModalVisible(true)
                        }}
                        style={styles.post}>
                        <Text style={styles.postText}>Post</Text>
                    </TouchableOpacity>
                    <Modal transparent={true} visible={isModalVisible} animationType="slide">
                        <BlurView
                            style={{ flex: 1 }}
                            intensity={10}
                        >
                            <KeyboardAvoidingView>
                                <View style={styles.modalMain}>
                                    <Text style={styles.modalTitle}>Post Something</Text>
                                    <TextInput
                                        style={styles.inputTitle}
                                        placeholder="Title"
                                        placeholderTextColor={'black'}
                                        onChangeText={(text) => setTitle(text)}
                                    />
                                    <TextInput
                                        style={styles.inputDesc}
                                        placeholder="Description"
                                        placeholderTextColor={'black'}
                                        onChangeText={(text) => setDescription(text)}
                                    />
                                    <TouchableOpacity style={styles.modalPost} onPress={handlePost}>
                                        <Text style={styles.modalText}>Post</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalCancel} onPress={() => { setIsModalVisible(false) }}>
                                        <Text style={styles.modalText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                        </BlurView>
                    </Modal>
                </View>
            )
            }
        </View>
    )
}

export default Farmer

const styles = StyleSheet.create({
    title: {
        alignSelf: 'center',
        fontSize: 24,
        margin: 12,
    },
    divider: {
        backgroundColor: 'black',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 100,
        height: 0.01 * screenHeight,
        width: 0.6 * screenWidth
    },
    main: {
        flex: 1,
        backgroundColor: 'white'
    },
    loading: {
        paddingTop: 0.4 * screenHeight,
    },
    list: {
        flex: 0.9,
        marginTop: 10,
        marginBottom: 10,
    },
    card: {
        alignSelf: 'center',
        width: 0.9 * screenWidth,
        marginTop: 20,
        padding: 10,
        backgroundColor: '#F9F6F3',
        borderWidth: 2, // Add this line to set the border width
        borderColor: 'black', // Add this line to set the border color
        borderRadius: 15
    },
    post: {
        backgroundColor: '#9EC19D',
        alignItems: 'center',
        justifyContent: 'center',
        width: 0.8 * screenWidth,
        alignSelf: 'center',
        borderRadius: 10,
        height: 50
    },
    postText: {
        color: 'black'
    },
    modalMain: {
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 25,
        backgroundColor: 'white',
        height: 0.5 * screenHeight,
        marginTop: 0.25 * screenHeight,
        width: 0.9 * screenWidth
    },
    modalTitle: {
        fontSize: 26,
        marginTop: 25,
        marginBottom: 25,
    },
    inputTitle: {
        textAlign: 'center',
        margin: 10,
        width: 0.75 * screenWidth,
        height: 0.05 * screenHeight,
        borderRadius: 15,
        borderWidth: 1
    },
    inputDesc: {
        textAlign: 'center',
        margin: 10,
        width: 0.75 * screenWidth,
        height: 0.15 * screenHeight,
        borderRadius: 15,
        borderWidth: 1
    },
    modalText: {
        textAlign: 'center',
        justifyContent: 'center',
        color: 'black'
    },
    modalPost: {
        backgroundColor: '#7fffd4',
        marginTop: 10,
        padding: 10,
        width: 0.5 * screenWidth,
        borderRadius: 15,
        borderWidth: 1,
    },
    modalCancel: {
        backgroundColor: '#f1807e',
        marginTop: 10,
        padding: 10,
        width: 0.5 * screenWidth,
        borderRadius: 15,
        borderWidth: 1,
    }
})