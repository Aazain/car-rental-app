import { View, Text, Pressable, FlatList, StyleSheet, Image, SafeAreaView, Button } from "react-native"
import CreateListing from "./CreateListing"

import {db, auth} from "../firebaseConfig"
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"


const Listings = ({navigation}) => {
    const [listings, setListings] = useState([]);
    
    useEffect(()=>{
        getListings()
    },[])

    useEffect(()=>{
        navigation.setOptions({
            title:"Your Listings",
            headerStyle: {backgroundColor: "#dda15e"},
            headerLeft: () => (
                <Button title="Logout" onPress={logoutUser}></Button>
            ),
          })
   
    },[navigation])

    const logoutUser = () => {
        auth.signOut()
        navigation.goBack()
    }
    
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
                                        borderWidth: 1, 
                                        borderColor: 'white', 
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
                    ItemSeparatorComponent={()=>{
                        return <View style={{borderWidth:1, borderColor:"black", marginVertical: 15}}></View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dda15e'
  },

  listingButton: {
    backgroundColor: "#283618",
    paddingHorizontal: 100,
    paddingVertical: 25,
    borderRadius: 20,
  },

  listingContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },

  listings: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    height: 150,
  },

  listingDetails: {
    marginTop: 10,
    gap: 5
  }

});

export default Listings





// const listData = []

// const total = function getTotal(){
//     let totalAmount = 0;
//     for (let i = 0; i < listData.length; i++){
//       if(listData[i].isDeposit){
//         totalAmount += Number(listData[i].amount)
//       }
//       else{
//         totalAmount -= Number(listData[i].amount)
//       }
//     }
//     return totalAmount.toFixed(2)
//   }
  
//   const Screen2 = ({route}) => {
    
//       listData.push({id: route.params.id, name: route.params.name, amount: route.params.amount, isDeposit: route.params.isDeposit})
  
//       return(
//           <View style={styles.container}>            
//               <FlatList
//                   data={listData}
//                   key={(item)=>{return item.id}}
//                   renderItem={(
//                       {item})=>{
//                           return(
//                               <View style={styles.row}>
//                                   <Pressable onPress={total}>
//                                     <AntDesign name="delete" size={24} color="black" />
//                                   </Pressable>
//                                   <Text style={styles.text}>{item.id}</Text>
//                                   <Text style={styles.text}>{item.name}</Text>
//                                   <Text style={styles.text}>{item.isDeposit ? 'Deposit' : 'Expense'}</Text>
//                                   <Text style={styles.text}>{item.isDeposit ? '+$' + item.amount : '-$' + item.amount}</Text>
//                               </View>
//                           )
//                       }
//                   }
//                   ItemSeparatorComponent={()=>{
//                       return (
//                           <View style={styles.line}></View>
//                       )
//                   }}
//               />
              
//               <View style={styles.box}>
//                   <Text style={styles.btnText}>Total: ${total()}</Text>
//               </View>
//           </View>
//       )
//   }