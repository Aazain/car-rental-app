import { View, Text, Button, TextInput, FlatList } from "react-native"
import CreateListing from "./CreateListing"
import { db } from '../firebaseConfig'
import { collection, getDocs } from "firebase/firestore"


const Listings = ({navigation}) => {
    return(
        <View>
            <Button title="Create Listing" onPress={() => navigation.navigate('Create-Listing')}/>
            <Text>Testing Listings</Text>
            <FlatList

            />
        </View>
    )
}

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