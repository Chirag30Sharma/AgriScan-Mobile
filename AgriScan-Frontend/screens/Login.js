import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, Dimensions, Image, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../global/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '@env';

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#0C500A",
  secondary: "#123911",
  grey: "#CCCCCC",
  red: "#FF0000"
}

const { width } = Dimensions.get('window');
const maxWidth = width - 50; // Adjust the maximum width as needed

const CustomButton = ({ title, filled, style, onPress }) => {
  const filledBgColor = filled ? COLORS.primary : COLORS.white;
  const textColor = filled ? COLORS.white : COLORS.primary;

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: filledBgColor,
        ...style
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 18, color: textColor }}>{title}</Text>
    </TouchableOpacity>
  );
}

const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('')

  const { setUser } = useUser();

  const handlePhone = (text) => {
    setPhone(text)
  }

  const handlePassword = (text) => {
    setPassword(text)
  }

  const beforeNavigation = async () => {
    await axios.post(`${BASE_URL}/user/login`, {
      "phone_number": phone,
      "password": password
    }).then(response => {
      if (response.data.code == 1) {
        const userData = {
          fname: response.data.first_name,
          lname: response.data.last_name,
          phone: response.data.phone_number,
        };
        setUser(userData);
        navigation.navigate('Main')
      }
      if (response.data.code == 2) {
        Alert.alert(
          'Oops!',
          'You Haven\'t Registered'
        );
      }
      if (response.data.code == 3) {
        Alert.alert(
          'Oops!',
          'Your Password Is Wrong'
        );
      }
    }).catch(error => {
      console.log(error)
      Alert.alert(
        'Oops!',
        'Our Server Is Down'
      )
    })
  }

  const handleForgotPassword = () => {
    setIsForgotPasswordModalVisible(true);
  };

  const handleSendResetLink = () => {
    setIsForgotPasswordModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        
        <View style={styles.container}>
          <View style={styles.upContainer}></View>
          <View style={styles.downContainer}></View>
          <View style={styles.buttonContainer}>
          <Image
            source={require("../assets/login.png")}
            style={{
              width: 150,
              height: 170,
              borderRadius: 20,
              position: "absolute",
              top: -20, // Center vertically
              margin: 'auto',
            }}
          />


          <View style={styles.gradcontainer}>

            <LinearGradient
              colors={['#BCFFB2', '#BF9E9E']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 1]}
            >
              
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                keyboardVerticalOffset={1}
              >

                  <View style={styles.buttonBox}>
                  <Text style={styles.title}>Welcome Back!</Text>
                    <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      placeholder="Enter your Phone Number"
                      placeholderTextColor={COLORS.black}
                      keyboardType="numeric"
                      style={styles.input}
                      onChangeText={handlePhone}
                    />
                    </View>
                    <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.passwordInput}>
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.black}
                      secureTextEntry={!isPasswordShown}
                      style={styles.input}
                      onChangeText={handlePassword}
                    />
                    <TouchableOpacity
                      onPress={() => setIsPasswordShown(!isPasswordShown)}
                      style={styles.showPasswordIcon}
                    >
                      <Ionicons
                        name={isPasswordShown ? 'eye-off' : 'eye'}
                        size={24}
                        color={COLORS.black}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <CustomButton
                  title="Login"
                  filled
                  style={styles.loginButton}
                  onPress={() => { beforeNavigation() }}
                  // onPress={() => { navigation.navigate('Main') }}
                />

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signupLink}>Register</Text>
                  </TouchableOpacity>
                </View>
                </View>

              </KeyboardAvoidingView>
        </LinearGradient>
        <Modal
        visible={isForgotPasswordModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Forgot Password</Text>
            <Text style={styles.modalDescription}>Please enter your Phone Number to reset your password.</Text>
            <TextInput
              placeholder="Enter your Phone Number"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
              style={styles.modalInput}
              onChangeText={(text) => setPhone(text)}
            />
            <CustomButton
              title="Send Reset Link"
              filled
              style={styles.modalButton}
              onPress={handleSendResetLink}
            />
            <TouchableOpacity
              onPress={() => setIsForgotPasswordModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      </View>
      </View>
      
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  upContainer: {
    flex: 0.7,
    backgroundColor: '#A4BCB6',
  },
  downContainer: {
    flex: 1,
  },
  gradcontainer: {
    overflow: 'hidden',
    borderStyle: 'solid',
    borderRadius: 15,
    flex: 0.6,
  },
  buttonContainer: {
    position: 'absolute',
    top: 90,
    width: '100%',
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBox: {
    padding: 30,
    width: maxWidth,
  },
  button: {
    paddingBottom: 16,
    paddingVertical: 10,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    alignSelf: 'center', 

  },
  
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginVertical: 2,
    color: COLORS.black,
    textAlign: 'center', 
  },
  description: {
    fontSize: 16,
    color: COLORS.black,
  },
  inputContainer: {
    marginBottom: 10,
    marginTop: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 6,
    marginVertical: 5,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 22,
    backgroundColor: '#F6F6E9',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordIcon: {
    position: 'absolute',
    right: 12,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'right',
    marginTop: 0,
    marginBottom: 5,
    
  },
  loginButton: {
    marginTop: 18,
    marginBottom: 4,
  },
  signupContainer: {
    marginTop: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 22,
  },
  signupText: {
    fontSize: 16,
    color: COLORS.black,
  },
  signupLink: {
    fontSize: 16,
    color: '#0015CF',
    fontWeight: 'bold',
    marginLeft: 6,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 10,
  },
  modalCloseText: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 10,
  },

});

export default Login;
