import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, Modal, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../global/UserContext';
import axios from 'axios';
import { BASE_URL } from '@env';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from expo vector icons

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#154214",
  secondary: "#F6F6E9",
  grey: "#CCCCCC",
  red: "#FF0000"
};

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
};

const EyeIcon = ({ onPress, visible }) => (
  <TouchableOpacity onPress={onPress} style={styles.eyeIconContainer}>
    <Ionicons name={visible ? 'eye' : 'eye-off'} size={24} color={COLORS.black} />
  </TouchableOpacity>
);

const Profile = () => {
  const { userData } = useUser();
  const navigation = useNavigation();
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match');
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/changepassword`, {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmNewPassword,
        phone_number: userData.phone,
      });

      if (response.status === 200) {
        alert('Password changed successfully');
      } else {
        alert('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing password');
    }
  
    setChangePasswordModalVisible(false);
  };
  
  const toggleChangePasswordModal = () => {
    setChangePasswordModalVisible(!isChangePasswordModalVisible);
  };

  const handleLogout = () => {
    navigation.popToTop()
  };

  return (
    <LinearGradient
      colors={['#BCFFB2', 'white']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.header}>
        <Image
          source={require('../assets/farmer.png')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userData.fname} {userData.lname}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{userData.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.value}>{userData.fname}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.value}>{userData.lname}</Text>
        </View>

        <Button
          title="Edit Profile"
          filled
          style={styles.editButton}
          onPress={() => {
            navigation.navigate('EditProfile');
          }}
        />

        <Button
          title="Crops grown"
          filled
          style={styles.editButton}
          onPress={() => {
            navigation.navigate('CropGrown');
          }}
        />


        <Button
          title="Change Password"
          filled
          style={styles.editButton}
          onPress={toggleChangePasswordModal}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isChangePasswordModalVisible}
          onRequestClose={toggleChangePasswordModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Change Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Current Password"
                  secureTextEntry={!showCurrentPassword}
                  placeholderTextColor={COLORS.black}
                  value={currentPassword}
                  onChangeText={(text) => setCurrentPassword(text)}
                />
                <EyeIcon
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  visible={showCurrentPassword}
                />
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  secureTextEntry={!showNewPassword}
                  placeholderTextColor={COLORS.black}
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />
                <EyeIcon
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  visible={showNewPassword}
                />
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm New Password"
                  secureTextEntry={!showConfirmNewPassword}
                  placeholderTextColor={COLORS.black}
                  value={confirmNewPassword}
                  onChangeText={(text) => setConfirmNewPassword(text)}
                />
                <EyeIcon
                  onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  visible={showConfirmNewPassword}
                />
              </View>
              <Button
                title="Save"
                filled
                style={styles.modalButton}
                onPress={() => {
                  handleChangePassword();
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                  toggleChangePasswordModal();
                }}
              />
              <Button
                title="Cancel"
                style={styles.modalButton}
                onPress={toggleChangePasswordModal}
              />
            </View>
          </View>
        </Modal>

      </View>

      <Button
        title="Logout"
        filled
        style={styles.logoutButton}
        onPress={handleLogout}
      />
    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  button: {
    paddingBottom: 16,
    paddingVertical: 10,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLORS.black,
  },
  info: {
    marginTop: 20,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  value: {
    fontSize: 16,
    color: COLORS.black,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: COLORS.grey,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  modalButton: {
    marginTop: 10,
  },
});

export default Profile;
