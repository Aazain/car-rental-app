import { View, Text, Button, TextInput, StyleSheet, Pressable } from "react-native"
import {useState} from "react"
import Listings from "./Listings"
import { db } from "../firebaseConfig"

const Login = ({navigation}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginPressed = () => {
        navigation.navigate('Listings')
    }

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <View>
                <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} />
            </View>
            <Pressable onPress={loginPressed}>
                <Text>Login Button</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login