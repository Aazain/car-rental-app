import { View, Text, Pressable, FlatList, StyleSheet, Image, SafeAreaView, Button } from "react-native"
import CreateListing from "./CreateListing"

import {db, auth} from "../firebaseConfig"
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"


const Listings = ({navigation}) => {
    const [listings, setListings] = useState([]);
    
    useEffect(()=>{
        getListings()
    },[listings])
    
    const getListings = async () => {
        try{
            const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid))
            const profile = docSnap.data()
            if (profile.isOwner === false){
                alert("Unauthorized Access: Must be a vehicle owner to view this page.")
                navigation.goBack()
            }

            const q = query(collection(db, "listings"), where("owner", "==", auth.currentUser.uid))
            const querySnapshot = await getDocs(q) 
            const temp = []
            querySnapshot.forEach((currDoc)=>{
                temp.push({...currDoc.data(), id: currDoc.id})
            })
            setListings(temp)
        }catch(err){
            console.log(err)
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.listingContainer}>
                <Text style={{fontWeight: "bold", fontSize: 30, marginBottom: 20}}>Your Listings</Text>
                <View style={{borderWidth:1, borderColor:"black", height: 1, width: 350 }}></View>
                <FlatList
                    data={listings}
                    keyExtractor={(item)=>{return item.id}}
                    renderItem={({item})=>{
                        return(
                            <View style={styles.listings}>
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
                                <View style={styles.textContainer}>
                                    <Text style={{fontSize: 20, fontWeight: "bold"}}>{item.make + " " + item.model}</Text>
                                    <View style={styles.listingDetails}>
                                        <Text>Plate: {item.plate}</Text>
                                        <Text>Cost: {"$" + item.cost}</Text>
                                        <Text style={{width: 150}}>Location: {item.address + ", " + item.city}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
            <Pressable onPress={() => navigation.navigate('Create-Listing', { user: auth.currentUser.uid })}>
                    <View style={styles.listingButton}>
                        <Text style={{fontWeight: "bold", fontSize: 20, color: 'white'}}>Create Listing</Text>
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
    height: 150,
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

export default Listings



