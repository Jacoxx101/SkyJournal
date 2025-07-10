import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const LandingScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // First fade in the background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Then scale and slide in the text
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Auto-hide after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish(); // Call the finish callback
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Background gradient effect */}
        <View style={styles.backgroundGradient} />
        
        {/* Animated content */}
        <Animated.View 
          style={[
            styles.content,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          <Text style={styles.title}>Sky Journal</Text>
          <Text style={styles.subtitle}>Capture the sky, every day.</Text>
          
          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <Animated.View 
                style={[
                  styles.loadingProgress,
                  {
                    transform: [{
                      scaleX: fadeAnim
                    }]
                  }
                ]}
              />
            </View>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </Animated.View>

        {/* Decorative elements */}
        <View style={styles.decorativeElements}>
          <Animated.View 
            style={[
              styles.circle,
              styles.circle1,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.circle,
              styles.circle2,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    // Sky gradient colors
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -100 }],
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 60,
    fontWeight: '400',
    opacity: 0.9,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingBar: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    transformOrigin: 'left',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: '20%',
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: '25%',
    left: -30,
  },
}); 