import { View, Text, Pressable, FlatList, StyleSheet, Image, SafeAreaView, Button } from "react-native"
import CreateListing from "./CreateListing"

import {db, auth} from "../firebaseConfig"
import { doc, getDoc, getDocs, collection, query, where, deleteDoc } from "firebase/firestore"
import { useEffect, useState } from "react"


const Bookings = ({navigation}) => {
    const [bookings, setBookings] = useState([]);

    
    useEffect(()=>{
        getBookings()
    },[bookings])

    useEffect(()=>{
        navigation.setOptions({
            headerStyle: {backgroundColor: "#f8f9fa"},
            headerLeft: () => (
                <Button title="Logout" onPress={logoutUser}></Button>
            ),
          })
   
    },[navigation])

    const logoutUser = () => {
        auth.signOut()
        navigation.goBack()
    }

    const getBookings = async () => {
        try {
            const q = query(collection(db, "bookings"), where("ownerId", "==", auth.currentUser.uid))
            const querySnapshot = await getDocs(q) 
            const temp = []
            querySnapshot.forEach((currDoc)=>{
                temp.push({...currDoc.data(), id: currDoc.id})
            })
            setBookings(temp)
        }catch(err){
            console.log(err)
        }
    }

    const cancelBooking = async (id) => {
        try{
            await deleteDoc(doc(db, "bookings", id))
            console.log(bookings)
        }catch(err){
            console.log(err)
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.listingContainer}>
                <Text style={{fontWeight: "bold", fontSize: 30, marginBottom: 20}}>Your Bookings</Text>
                <View style={{borderWidth:1, borderColor:"black", height: 1, width: 350 }}></View>
                <FlatList
                    data={bookings}
                    keyExtractor={(item)=>{return item.id}}
                    renderItem={({item})=>{
                        return(
                            <View style={styles.listings}>
                                <View>
                                    <Image
                                        style={{ 
                                            width: 200, 
                                            height: 100, 
                                            marginRight: 10,
                                            borderWidth: 2, 
                                            borderColor: 'black', 
                                            borderRadius: 20 
                                        }}
                                        source={{uri: item.photo}}
                                        resizeMode="cover"
                                    />
                                    <Pressable onPress={()=>{cancelBooking(item.id)}}>
                                        <View style={styles.cancelButton}>
                                            <Text style={{fontWeight: "bold", fontSize: 20, color: 'white'}}>Cancel</Text>
                                        </View>
                                    </Pressable>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={{fontSize: 20, fontWeight: "bold"}}>{item.make + " " + item.model}</Text>
                                    <View style={styles.listingDetails}>
                                        <Text>Plate: {item.plate}</Text>
                                        <Text>Cost: {"$" + item.cost}</Text>
                                        <Text style={{width: 150}}>Location: {item.address + ", " + item.city}</Text>
                                        <Text style={{width: 150}}>Renter: {item.renterFirstName + " " + item.renterLastName}</Text>
                                        <Text style={{width: 150}}>Confirmation: {item.confirmationCode}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
            <Pressable onPress={() => navigation.navigate('Listings', { user: auth.currentUser.uid })}>
                    <View style={styles.listingButton}>
                        <Text style={{fontWeight: "bold", fontSize: 20, color: 'white'}}>View Listings</Text>
                    </View>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa'
  },

  listingButton: {
    backgroundColor: "#3a7ca5",
    paddingHorizontal: 100,
    paddingVertical: 25,
    borderRadius: 20,
    borderWidth: 3,
  },
  cancelButton: {
    backgroundColor: "red",
    borderRadius: 20,
    borderWidth: 3,
    padding: 15,
    marginTop: 15,
    width: 110
  },

  listingContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  listings: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: 300,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
  },

  listingDetails: {
    marginTop: 10,
    gap: 5
  }

});

export default Bookings
