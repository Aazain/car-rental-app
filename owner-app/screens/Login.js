import { View, Text, Button, TextInput, StyleSheet, Pressable, SafeAreaView } from "react-native"
import {useState} from "react"
import Listings from "./Listings"
import { db, auth } from "../firebaseConfig"
import {signInWithEmailAndPassword } from "firebase/auth";

const Login = ({navigation}) => {
    // const [email, setEmail] = useState("aazaintest@gmail.com");
    // const [password, setPassword] = useState("testpassword");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const authenticateUser = async () => {
        try{
            await signInWithEmailAndPassword(auth, email, password)
            navigation.navigate('Bookings')
        }catch(err){
            alert(err)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontSize: 60, fontWeight: 'bold', textAlign: 'left', width: 260}} >Login</Text>
            <View style={styles.inputContainer}>
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="Email" value={email} onChangeText={setEmail} />
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="Password" value={password} onChangeText={setPassword} />
            </View>
            <Pressable onPress={authenticateUser} style={styles.loginButton}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: 'white'}} >Login</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputContainer: {
    margin: 20,
    gap: 20,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
},

  inputField: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    width: 260,
    textAlign: 'left'
  },

  loginButton: {
    backgroundColor: "#3a7ca5",
    paddingHorizontal: 100,
    paddingVertical: 25,
    borderRadius: 20,
    borderWidth: 3,
  }
});

export default Login