import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- SVG Icon Components with Colors (same as App.js) ---

const CloudIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WeatherIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="5" fill="#FEF08A" stroke="#FBBF24" strokeWidth="2" />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AltitudeIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="m8 3 4 8 5-5 5 15H2L8 3z" fill="#A16207" stroke="#422006" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// --- Helper Functions for Formatting ---

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// --- The Modal Component ---

export const PhotoDetailModal = ({ 
  visible, 
  photo, 
  onClose, 
  scaleAnim 
}) => {
  if (!photo) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalBackground} onPress={onClose} activeOpacity={1}>
          <Animated.View style={[styles.modalCard, { 
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim 
          }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.headerTitle}>Sky Journal</Text>

              {/* Photo */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.image}
                />
              </View>

              {/* Location and Date */}
              <View style={styles.locationDateSection}>
                <View style={styles.locationContainer}>
                  <Text style={styles.locationEmoji}>📍</Text>
                  <Text style={styles.locationText}>{photo.loc?.city || 'Unknown Location'}</Text>
                </View>
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.dateText}>{formatDate(photo.timestamp)}</Text>
                  <Text style={styles.timeText}>{formatTime(photo.timestamp)}</Text>
                </View>
              </View>

              {/* Weather Card */}
              <View style={styles.weatherCard}>
                <View style={styles.weatherRow}>
                  <CloudIcon />
                  <Text style={styles.weatherText}>Cirrus</Text>
                </View>
                <View style={styles.weatherRow}>
                  <WeatherIcon />
                  <Text style={styles.weatherText}>Fair weather</Text>
                </View>
                <View style={styles.weatherRow}>
                  <AltitudeIcon />
                  <Text style={styles.weatherText}>Low Altitude (0–6 k ft)</Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// --- Styles (same as App.js with modal-specific adjustments) ---

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width - 40,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  scrollContainer: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3748', // pastel-text-main
    textAlign: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 500,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  locationDateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 24,
    paddingHorizontal: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationEmoji: {
    fontSize: 20,
  },
  locationText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748', // pastel-text-main
    marginLeft: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 10,
  },
  weatherCard: {
    backgroundColor: '#E8F0FE',
    borderRadius: 16,
    marginTop: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  weatherText: {
    fontSize: 16,
    color: '#2D3748', // pastel text
    marginLeft: 12,
  },
}); 