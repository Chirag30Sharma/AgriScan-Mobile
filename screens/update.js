import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import { useState } from 'react';
import React from 'react'
import { Dimensions } from 'react-native';
import axios from 'axios'
import { useUser } from '../global/UserContext';
import { BASE_URL } from '@env';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const imageWidth = (screenWidth * 80) / 100;
const imageHeight = (screenHeight * 20) / 100;

const Update = () => {

    return (
        <Text>Here, The Weather and some Agriculture News will Come.</Text>
    );
}

export default Update

const styles = StyleSheet.create({

})