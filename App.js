// 🧭 Apple-Inspired Sky Journal (Polished Version)
import React, { useState, useEffect, useRef } from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  Dimensions,
  Image,
  Animated,
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { PhotoDetailModal } from './components/PhotoDetailModal';

// 🖼️ Layout
const { width, height } = Dimensions.get('window');
const COLORS = {
  background: '#F9F9F9',
  surface: '#FFFFFF',
  card: '#F2F2F7',
  text: '#1C1C1E',
  muted: '#8E8E93',
  accent: '#007AFF',
  danger: '#FF3B30',
  primary: '#0A84FF'
};

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const stored = await AsyncStorage.getItem('sky_photos');
      if (stored) setPhotos(JSON.parse(stored));
    } catch (e) {
      Alert.alert('Oops', 'Failed to load photos.');
    }
  };

  const save = async (data) => {
    try {
      await AsyncStorage.setItem('sky_photos', JSON.stringify(data));
    } catch (e) {
      Alert.alert('Oops', 'Could not save.');
    }
  };

  const pick = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const timestamp = new Date().toISOString();
      let loc = { city: 'Unknown', country: 'Unknown' };
      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        const rev = await Location.reverseGeocodeAsync(coords);
        loc = { city: rev[0]?.city || 'City', country: rev[0]?.country || 'Country' };
      } catch {}
      const newItem = { id: Date.now(), uri, timestamp, loc };
      const updated = [newItem, ...photos];
      setPhotos(updated);
      save(updated);
    }
  };

  const show = (item) => {
    setSelected(item);
    scaleAnim.setValue(0);
    setModalVisible(true);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true
    }).start();
  };

  const hide = () => setModalVisible(false);

  const date = (ts) => new Date(ts).toLocaleDateString();
  const time = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Sky Journal</Text>
        <Text style={styles.sub}>Captured Moments: {photos.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {photos.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => show(p)}
            style={styles.card}
            activeOpacity={0.85}>
            <Image source={{ uri: p.uri }} style={styles.thumb} />
            <View style={styles.meta}>
              <Text style={styles.locationText}>📍 {p.loc.city}, {p.loc.country}</Text>
              <Text style={styles.dateText}>{date(p.timestamp)} · {time(p.timestamp)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={pick} style={styles.fab} activeOpacity={0.8}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Photo Detail Modal */}
      <PhotoDetailModal
        visible={modalVisible}
        photo={selected}
        onClose={hide}
        scaleAnim={scaleAnim}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.card,
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text
  },
  sub: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumb: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.card
  },
  meta: {
    padding: 12
  },
  locationText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700'
  },
  dateText: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300'
  },

});
