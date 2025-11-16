import {useState} from "react"
import { View, Text, Button, TextInput, StyleSheet, Pressable } from "react-native"
import { db } from "../firebaseConfig"
import { collection, addDoc } from "firebase/firestore";


const CreateListing = ({route, navigation}) => {
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [plate, setPlate] = useState("")
    const [cost, setCost] = useState("")
    const [photo, setPhoto] = useState("")
    const [city, setCity] = useState("")
    const [address, setAddress] = useState("")
    const { user } = route.params 

    const listingConfirmed = async () => {
        const listingToCreate = {
            make: make,
            model: model,
            plate: plate,
            cost: parseFloat(cost),
            photo: photo,
            city: city,
            address: address,
            owner: user
        }

        try {
            const docRef = await addDoc(collection(db, "listings"), listingToCreate)
            alert(`Created Listing: ${docRef.id}`)
            navigation.goBack()
        } catch (err){
            console.log(err)
        }
    }

    return(
        <View style={styles.container}>
            <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'left', width: 260}} >Create Listing</Text>
            <View style={styles.inputContainer}>
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="Make" value={make} onChangeText={setMake} />
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="Model" value={model} onChangeText={setModel} />
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="License Plate" value={plate} onChangeText={setPlate} />
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="Cost" keyboardType="decimal-pad" value={cost} onChangeText={setCost}/>
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="Photo Link" value={photo} onChangeText={setPhoto} scrollEnabled={true} />
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="City" value={city} onChangeText={setCity} />
                <TextInput placeholderTextColor={'black'} style={styles.inputField} placeholder="Address" value={address} onChangeText={setAddress} />
            </View>
            <Pressable style={styles.confirmListing} onPress={listingConfirmed}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: 'white'}}>Confirm Listing</Text>
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
    textAlign: 'left',
  },

  confirmListing: {
    backgroundColor: "#3a7ca5",
    paddingHorizontal: 80,
    paddingVertical: 25,
    borderRadius: 20,
    borderWidth: 3,
  }
});


export default CreateListing