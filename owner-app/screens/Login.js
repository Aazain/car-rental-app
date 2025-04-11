import { View, Text, Button, TextInput } from "react-native"
import Listings from "./Listings"

const Login = ({navigation}) => {
    return (
        <View>
            <Text>Login</Text>
            <View>
                <TextInput placeholder="Username"></TextInput>
                <TextInput placeholder="Password"></TextInput>
            </View>
            <Button title="Login" onPress={() => navigation.navigate('Listings')}>Login</Button>
        </View>
    )
}


export default Login