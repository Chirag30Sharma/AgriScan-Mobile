import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './screens/main'
import { SafeAreaView } from 'react-native';
import { UserProvider } from './global/UserContext';
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import Signup from './screens/Signup'
import Profile from './screens/profile';
import EditProfile from './screens/EditProfile'
import CropGrown from './screens/CropGrown';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Welcome}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CropGrown"
              component={CropGrown}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Main"
              component={Main}
              options={{ headerShown: false }}
            // for final uncomment below and remove up wala
            // options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaView>

  );
}