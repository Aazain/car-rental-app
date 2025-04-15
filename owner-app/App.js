import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./screens/Login"
import Listings from "./screens/Listings"
import CreateListing from './screens/CreateListing';
import Bookings from './screens/Bookings'


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerTitle: '' }}/>
        <Stack.Screen name="Bookings" component={Bookings} options={{ headerTitle: '', headerBackVisible: false}}/>
        <Stack.Screen name="Listings" component={Listings} options={{ headerTitle: ''}}/>
        <Stack.Screen name="Create-Listing" component={CreateListing} options={{ headerTitle: '' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
