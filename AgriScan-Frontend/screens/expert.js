import { StyleSheet, Text, View, Button, FlatList, ActivityIndicator, Image } from 'react-native'
import { Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios'
import { useUser } from '../global/UserContext';
import { BASE_URL } from '@env';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Expert = ({ }) => {

    const { userData } = useUser();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        axios
            .post(`${BASE_URL}/history`, { "phone_number": userData.phone })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(true);
            });
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
                    <Text style={styles.title}>Model Reply History</Text>
                    <View style={styles.divider} />
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => {
                            return item._id || index.toString();
                        }}
                        style={styles.list}
                        renderItem={({ item }) => (
                            <View key={item._id} style={styles.card}>
                                <View style={{ flexDirection: 'row' }}>
                                    {item.photo && (
                                        <Image
                                            source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
                                            style={{ width: 100, height: 240, alignSelf: 'center' }}
                                        />
                                    )}
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Disease: </Text>
                                        <Text style={{ textAlign: 'center', fontSize: 15 }}>{item.predicted_label}</Text>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Diagnose: </Text>
                                        <Text style={{ textAlign: 'center', fontSize: 15 }}>{item.diagnosis}</Text>
                                        <Text style={{ textAlign: 'center' }}>_____________________________</Text>
                                        <Text style={{ paddingTop: 15, textAlign: 'center', fontWeight: 'bold' }}>Prescription: </Text>
                                        <Text style={{ paddingTop: 15, textAlign: 'center', fontSize: 15 }}>{item.prescription}</Text>
                                        <Text style={{ paddingTop: 15, textAlign: 'center', fontWeight: 'bold' }}>Possible Remedies:</Text>
                                        <Text style={{ paddingTop: 15, textAlign: 'center', fontSize: 15 }}>{item.steps_to_be_taken}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            )
            }
        </View>
    );
}

export default Expert

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
        backgroundColor: '#DAFFD4',
        borderRadius: 15
    },
    post: {
        backgroundColor: '#7fffd4',
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