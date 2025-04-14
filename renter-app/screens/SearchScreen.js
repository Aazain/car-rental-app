import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Alert, Button, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// TEMP: hardcoded renter UID (until login is implemented)
const dummyRenterId = "renter_demo_123";

export default function SearchScreen() {
  const [city, setCity] = useState('');
  const [listings, setListings] = useState([]);
  const [region, setRegion] = useState({
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(false);

  // Request location permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      }
    })();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'listings'), where('city', '==', city));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Geocode each listing's address to obtain coordinates
      const listingsWithCoords = await Promise.all(
        results.map(async (listing) => {
          try {
            const geocoded = await Location.geocodeAsync(listing.address);
            if (geocoded.length > 0) {
              return { ...listing, coordinate: geocoded[0] };
            } else {
              console.warn(`No coordinates found for address: ${listing.address}`);
              return null;
            }
          } catch (error) {
            console.error(`Geocoding error for address "${listing.address}":`, error);
            return null;
          }
        })
      );

      // Filter out any listings that failed to geocode
      const validListings = listingsWithCoords.filter(listing => listing !== null);
      setListings(validListings);

      // Update map region to center on the first valid listing
      if (validListings.length > 0) {
        setRegion({
          latitude: validListings[0].coordinate.latitude,
          longitude: validListings[0].coordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      Alert.alert("Error", "Failed to fetch listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city.trim().length > 0) {
      fetchListings();
    }
  }, [city]);

  const handleBooking = async (car) => {
    try {
      await addDoc(collection(db, 'bookings'), {
        renterId: dummyRenterId,
        carId: car.id,
        model: car.model,
        city: car.city,
        cost: car.cost,
        date: new Date().toISOString(),
        ownerId: car.owner,
        status: 'booked'
      });
      Alert.alert("✅ Booking Confirmed", `You booked the ${car.make} ${car.model}`);
    } catch (err) {
      console.error("Booking error:", err);
      Alert.alert("Booking failed", "Something went wrong. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your city"
        style={styles.input}
        value={city}
        onChangeText={setCity}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <MapView style={styles.map} region={region}>
          {listings.map((car) => (
            car.coordinate && car.coordinate.latitude && car.coordinate.longitude && (
              <Marker
                key={car.id}
                coordinate={{
                  latitude: car.coordinate.latitude,
                  longitude: car.coordinate.longitude
                }}
              >
                <Callout>
                  <View style={{ width: 200 }}>
                    <Text style={styles.bold}>{car.make} {car.model}</Text>
                    <Text>Plate: {car.plate}</Text>
                    <Text>${car.cost}/day</Text>
                    <Button title="BOOK NOW" onPress={() => handleBooking(car)} />
                  </View>
                </Callout>
              </Marker>
            )
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    padding: 10,
    borderBottomWidth: 1,
    margin: 10,
  },
  map: {
    flex: 1,
    width: width,
    height: height,
  },
  bold: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
