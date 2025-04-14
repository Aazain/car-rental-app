import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');
const dummyRenterId = 'renter_demo_123';

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
  const [selectedCar, setSelectedCar] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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
      const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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

      const validListings = listingsWithCoords.filter((listing) => listing !== null);
      setListings(validListings);

      if (validListings.length > 0) {
        setRegion({
          latitude: validListings[0].coordinate.latitude,
          longitude: validListings[0].coordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      Alert.alert('Error', 'Failed to fetch listings. Please try again.');
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
        status: 'booked',
      });
      Alert.alert('✅ Booking Confirmed', `You booked the ${car.make} ${car.model}`);
      setShowPopup(false);
    } catch (err) {
      console.error('Booking error:', err);
      Alert.alert('Booking failed', 'Something went wrong. Try again.');
    }
  };

  const openPopup = (car) => {
    setSelectedCar(car);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedCar(null);
    setShowPopup(false);
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
          {listings.map(
            (car) =>
              car.coordinate && (
                <Marker
                  key={car.id}
                  coordinate={{
                    latitude: car.coordinate.latitude,
                    longitude: car.coordinate.longitude,
                  }}
                  onPress={() => openPopup(car)}
                />
              )
          )}
        </MapView>
      )}

      {/* Modal popup for car details */}
      <Modal visible={showPopup} transparent animationType="fade" onRequestClose={closePopup}>
        <Pressable style={styles.modalOverlay} onPress={closePopup}>
          <View style={styles.popupContainer}>
            {selectedCar && (
              <>
                <Text style={styles.popupTitle}>
                  {selectedCar.make} {selectedCar.model}
                </Text>
                <Text>Plate: {selectedCar.plate}</Text>
                <Text>${selectedCar.cost}/day</Text>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBooking(selectedCar)}
                >
                  <Text style={styles.bookButtonText}>BOOK NOW</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  bookButton: {
    marginTop: 12,
    backgroundColor: '#3498db',
    paddingVertical: 8,
    borderRadius: 5,
  },
  bookButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
