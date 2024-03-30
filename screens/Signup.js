import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { BASE_URL } from '@env';

const { width } = Dimensions.get('window');
const maxWidth = width - 20; // Adjust the maximum width as needed

const Signup = ({ navigation }) => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePhone = (text) => {
    setPhone(text);
  };
  const handleFname = (text) => {
    setFname(text);
  };
  const handleLname = (text) => {
    setLname(text);
  };
  const handlePassword = (text) => {
    setPassword(text);
  };
  const handleConfirmPassword = (text) => {
    setConfirmPassword(text);
  };

  const setNull = () => {
    setFname('');
    setLname('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
  };

  const beforeNavigation = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/registration`, {
        first_name: fname,
        last_name: lname,
        phone_number: phone,
        password: password,
      });

      if (response.status === 201) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Oops!', 'Please Try Again Later');
      }
    } catch (error) {
      console.log('Error during registration:', error);
      Alert.alert('Oops!', 'Please Try Again Later');
    } finally {
      setNull(); // Reset form fields regardless of success or failure
    }
  };

  return (
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
        keyboardVerticalOffset={80}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Sign Up</Text>
          </View>

          <View>
            <Text style={styles.description}>
              Your Farming Partner in Your Pocket
            </Text>
          </View>

          <View style={styles.box}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number:</Text>
            </View>
            <TextInput
              style={[styles.inputStyle, { placeholderTextColor: 'gray' }]}
              keyboardType="numeric"
              placeholder="Enter your Phone Number"
              value={phone}
              onChangeText={handlePhone}
            />

            <View style={styles.nameContainer}>
              <View style={styles.name}>
                <Text style={styles.label}>First Name:</Text>

                <TextInput
                  style={[styles.inputStyle, { placeholderTextColor: 'gray' }]}
                  placeholder="Enter your first name"
                  value={fname}
                  onChangeText={handleFname}
                />
              </View>

              <View style={styles.name}>
                <Text style={styles.label}>Last Name:</Text>

                <TextInput
                  style={[styles.inputStyle, { placeholderTextColor: 'gray' }]}
                  placeholder="Enter your last name"
                  value={lname}
                  onChangeText={handleLname}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password:</Text>
            </View>
            <TextInput
              style={[styles.inputStyle, { placeholderTextColor: 'gray' }]}
              placeholder="Enter your password"
              secureTextEntry={true}
              value={password}
              onChangeText={handlePassword}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password:</Text>
            </View>
            <TextInput
              style={[styles.inputStyle, { placeholderTextColor: 'gray' }]}
              placeholder="Confirm your password"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={handleConfirmPassword}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  beforeNavigation();
                }}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                style={styles.loginLink}
              >
                Log in
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#323232',
    fontWeight: '700',
  },
  description: {
    maxWidth: maxWidth,
    color: '#072E06',
    fontSize: width <= 320 ? 12 : 15,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  box: {
    width: '100%',
    padding: 25,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 4,
  },
  inputStyle: {
    fontSize: 18,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    padding: 23,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  nameContainer: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
  },
  name: {
    paddingRight: 3,
    paddingLeft: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0C500A',
    color: 'white',
    width: 200,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: '#0015CF',
    fontWeight: 'bold',
  },
});

export default Signup;
