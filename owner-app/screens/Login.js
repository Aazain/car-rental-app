import { View, Text, Button, TextInput, StyleSheet, Pressable } from "react-native"
import {useState} from "react"
import Listings from "./Listings"
import { db, auth } from "../firebaseConfig"
import {signInWithEmailAndPassword } from "firebase/auth";

const Login = ({navigation}) => {
    const [email, setEmail] = useState("aazaintest@gmail.com");
    const [password, setPassword] = useState("testpassword");

    const authenticateUser = async () => {
        try{
            await signInWithEmailAndPassword(auth, email, password)
            navigation.navigate('Listings')
        }catch(err){
            alert(err)
        }
    }
    
    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <View>
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} />
            </View>
            <Pressable onPress={authenticateUser}>
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