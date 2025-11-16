import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

// Import your screens
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator containing Search and My Bookings screens
function MainTabs() {
  const navigation = useNavigation(); // Use the useNavigation hook

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
      navigation.navigate("Login"); // Navigate to the Login screen after logging out
    } catch (err) {
      alert('Logout Failed: ' + err.message);
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Search"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Search' ? 'search' : 'calendar';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          headerRight: () => (
            <Ionicons 
              name="log-out-outline" 
              size={25} 
              color="tomato" 
              style={{ marginRight: 10 }} 
              onPress={handleLogout} 
            />
          ),
        }} 
      />
      <Tab.Screen 
        name="My Bookings" 
        component={MyBookingsScreen} 
        options={{
          headerRight: () => (
            <Ionicons 
              name="log-out-outline" 
              size={25} 
              color="tomato" 
              style={{ marginRight: 10 }} 
              onPress={handleLogout} 
            />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator managing authentication and main app flow
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}