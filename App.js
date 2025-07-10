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
import { LandingScreen } from './components/LandingScreen';

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
  const [showLanding, setShowLanding] = useState(true);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleLandingFinish = () => {
    setShowLanding(false);
  };

  const load = async () => {
    try {
      const stored = await AsyncStorage.getItem('sky_photos');
      if (stored) setPhotos(JSON.parse(stored));
    } catch (e) {
      Alert.alert('Oops', 'Failed to load photos.');
    }
  };

  useEffect(() => {
    if (!showLanding) {
      load();
    }
  }, [showLanding]);

  if (showLanding) {
    return <LandingScreen onFinish={handleLandingFinish} />;
  }

  const save = async (data) => {
    try {
      await AsyncStorage.setItem('sky_photos', JSON.stringify(data));
    } catch (e) {
      Alert.alert('Oops', 'Could not save.');
    }
  };

  const pick = async () => {
    setLoading(true);
    
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setLoading(false);
      Alert.alert('Permission Required', 'Camera permission is needed to capture photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) {
      const asset = result.assets[0];

      // --- Basic validation ---
      // 1) Ensure the captured file is an image
      if (asset.type !== 'image') {
        setLoading(false);
        Alert.alert('❌ Invalid File', 'Please capture an image. This file type is not supported.');
        return;
      }

      // 2) Ensure file size ≤ 10 MB
      try {
        const info = await FileSystem.getInfoAsync(asset.uri, { size: true });
        const sizeMB = info.size / (1024 * 1024);
        if (sizeMB > 10) {
          setLoading(false);
          Alert.alert('📏 File Too Large', `Image size: ${sizeMB.toFixed(1)} MB\nPlease capture a smaller image (max 10 MB).`);
          return;
        }
        console.log(`✅ Image validation passed - Size: ${sizeMB.toFixed(2)} MB`);
      } catch (e) {
        console.warn('⚠️ Could not read file size', e);
      }

      // 3) Ensure minimum dimensions 300×300
      if (asset.width && asset.height && (asset.width < 300 || asset.height < 300)) {
        setLoading(false);
        Alert.alert('📐 Image Too Small', `Current size: ${asset.width}×${asset.height}px\nPlease capture an image at least 300×300 pixels.`);
        return;
      }
      
      console.log(`✅ Image dimensions valid: ${asset.width}×${asset.height}px`);

      const uri = asset.uri;
      const timestamp = new Date().toISOString();
      let loc = { city: 'Unknown', country: 'Unknown' };
      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        const rev = await Location.reverseGeocodeAsync(coords);
        loc = { city: rev[0]?.city || 'City', country: rev[0]?.country || 'Country' };
        console.log(`📍 Location captured: ${loc.city}, ${loc.country}`);
      } catch {}
      const newItem = { id: Date.now(), uri, timestamp, loc };
      const updated = [newItem, ...photos];
      setPhotos(updated);
      save(updated);
      console.log('✅ Photo saved successfully');
    } else {
      console.log('📷 Camera capture cancelled');
    }
    setLoading(false);
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

      {/* Header */}
      <View style={styles.header}></View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sky Journal</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {/* Today Section */}
        {photos.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today</Text>
          </View>
        )}

        {photos.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => show(p)}
            style={styles.card}
            activeOpacity={0.85}>
            <Image source={{ uri: p.uri }} style={styles.thumb} />
            <View style={styles.meta}>
              <Text style={styles.locationText}>📍 {p.loc.city}, {p.loc.country}</Text>
              <View style={styles.weatherContainer}>
                <Text style={styles.weatherText}>☁️ Cloudy</Text>
              </View>
              <Text style={styles.dateText}>{date(p.timestamp)} · {time(p.timestamp)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Photo Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          onPress={pick} 
          style={[styles.addButton, isLoading && styles.addButtonLoading]} 
          activeOpacity={0.8}
          disabled={isLoading}>
          {isLoading ? (
            <>
              <Text style={styles.addButtonIcon}>⏳</Text>
              <Text style={styles.addButtonText}>Processing...</Text>
            </>
          ) : (
            <>
              <Text style={styles.addButtonIcon}>＋</Text>
              <Text style={styles.addButtonText}>Add Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

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
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.surface,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  thumb: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.card,
  },
  meta: {
    padding: 16,
  },
  locationText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  weatherContainer: {
    marginBottom: 6,
  },
  weatherText: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '400',
  },
  addButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.surface,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonLoading: {
    opacity: 0.6,
    backgroundColor: COLORS.muted,
  },
  addButtonIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: '300',
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
