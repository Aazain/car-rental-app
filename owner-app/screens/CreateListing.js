import {useState} from "react"
import { View, Text, Button, TextInput, StyleSheet, Pressable } from "react-native"
import { db } from "../firebaseConfig"
import { collection, addDoc } from "firebase/firestore";
import Listings from "./Listings"


const CreateListing = ({navigation}) => {
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [plate, setPlate] = useState("")
    const [cost, setCost] = useState("")
    const [photo, setPhoto] = useState("")
    const [city, setCity] = useState("")
    const [address, setAddress] = useState("")

    const listingConfirmed = async () => {
        const listingToCreate = {
            make: make,
            mode: model,
            plate: plate,
            cost: parseFloat(cost),
            photo: photo,
            city: city,
            address: address
        }

        try {
            const docRef = await addDoc(collection(db, "listings"), listingToCreate)
            alert(`Created Listing: ${docRef.id}`)
            navigation.navigate("Listings")
        } catch (err){
            console.log(err)
        }
    }

    return(
        <View style={styles.container}>
            <Text>Create Listing</Text>
            <View>
                <TextInput placeholder="Make" value={make} onChangeText={setMake} />
                <TextInput placeholder="Model" value={model} onChangeText={setModel} />
                <TextInput placeholder="License Plate" value={plate} onChangeText={setPlate} />
                <TextInput placeholder="Cost" keyboardType="decimal-pad" value={cost} onChangeText={setCost} />
                <TextInput placeholder="Photo Link" value={photo} onChangeText={setPhoto} />
                <TextInput placeholder="City" value={city} onChangeText={setCity} />
                <TextInput placeholder="Address" value={address} onChangeText={setAddress} />
                <Pressable onPress={listingConfirmed}>
                    <Text>Create Listing</Text>
                </Pressable>
            </View>
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


export default CreateListing