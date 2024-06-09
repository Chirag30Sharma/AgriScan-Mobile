import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Gallery from './gallery'
import profile from './profile'
import Expert from './expert'
import Farmer from './farmer'
import Update from './update'

export default function Main() {
    const Tab = createMaterialBottomTabNavigator()
    return (
        <Tab.Navigator
            barStyle={{ backgroundColor: 'white', marginBottom: -18 }}
            ScreenOptions={{ headerShown: false, }}
        >
            <Tab.Screen name="Gallery" component={Gallery}
                options={{
                    tabBarLabel: 'Gallery',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="camera" size={30} />
                    ),
                }}
            />
            <Tab.Screen name="Community" component={Farmer}
                options={{
                    tabBarLabel: 'Community',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="account-group" size={30} />
                    ),
                }}
            />
            <Tab.Screen name="Expert" component={Expert}
                options={{
                    tabBarLabel: 'History',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="history" size={30} />
                    ),
                }}
            />
            <Tab.Screen name="Update" component={Update}
                options={{
                    tabBarLabel: 'Updates',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="weather-cloudy" size={30} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="account-circle" size={30} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({

});
