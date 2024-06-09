import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, ScrollView, TouchableOpacity } from 'react-native';

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#007260",
  secondary: "#39B68D",
  grey: "#CCCCCC",
  red: "#FF0000"
}

const Button = ({ title, filled, style, onPress }) => {
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

const handleSaveProfile = () => {
  // Handle saving the edited profile data here (e.g., API request or local storage)
  // You can also navigate back to the profile screen when done.
};

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState('');
  const [area, setArea] = useState('');
  const [crops, setCrops] = useState('');


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your state"
            value={state}
            onChangeText={(text) => setState(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Area</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your farming area (in acres)"
            value={area}
            onChangeText={(text) => setArea(text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Crops</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the crops you grow"
            value={crops}
            onChangeText={(text) => setCrops(text)}
          />
        </View>

        <Button
          title="Save Profile"
          filled
          style={styles.saveButton}
          onPress={handleSaveProfile}
      />

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingBottom: 16,
    paddingVertical: 10,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary, 
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.white, 
    },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.black, 
  },
  input: {
    height: 40,
    borderColor: COLORS.grey, 
    borderWidth: 1,
    paddingHorizontal: 10,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary, 
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default EditProfile;

