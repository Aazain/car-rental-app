import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

// TEMP: simulate logged-in renter
const dummyRenterId = 'renter_demo_123';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), where('renterId', '==', dummyRenterId));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(results);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      Alert.alert("Booking Cancelled", "Your booking has been removed.");
      fetchBookings(); // refresh
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.model}</Text>
      <Text>City: {item.city}</Text>
      <Text>Cost: ${item.cost}/day</Text>
      <Text>Status: {item.status}</Text>
      <Button title="Cancel Booking" onPress={() => cancelBooking(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <Text style={styles.empty}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  empty: {
    marginTop: 50,
    fontSize: 18,
    textAlign: 'center',
    color: 'gray'
  }
});
