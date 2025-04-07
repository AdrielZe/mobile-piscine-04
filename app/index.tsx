import { ImageBackground, StyleSheet, SafeAreaView, Text, Animated, Easing, View, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';
import { collection, doc, setDoc, getDoc, addDoc } from "firebase/firestore";
import { db } from './firebaseConfig'


export default function HomeScreen() {
	const {
		isLoggedIn,
		setIsLoggedIn,
		userInfo,
		setUserInfo,
	} = useAuth();

  const router = useRouter();
  SplashScreen.preventAutoHideAsync();



	const handlePress = () => {
		if (isLoggedIn) {
			setIsLoggedIn(true);
			router.replace('./tabs/logged-in-page');
		} else {
			setIsLoggedIn(false);
			router.push('./tabs/login-page');
		}
	     };
  const [fontsLoaded] = useFonts({
    'Jersey15': require('../assets/fonts/Jersey15.ttf'),
  });

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/lofi-breath.webp')}
        style={styles.background}
      >
        <Animated.View style={[styles.welcomeMsg, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.welcomeMsgText}>Welcome to your diary app</Text>
        </Animated.View>
          <TouchableOpacity 
            style={styles.buttonContainer} 
	     onPress={() => {
		handlePress()
	}
	     }>
            <Text style={styles.loginPageButton}>Log in</Text>
          </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}

// Mantenha seus estilos...

const styles = StyleSheet.create({
  container: {
	flex: 1,
  },
  background: {
	flex: 1,
	width: '100%',
	height: '100%',
	justifyContent: 'space-evenly',
	alignItems: 'center',
  },
  welcomeMsg: {
	width: 300,
	height: 200,
	borderRadius: 10,
	borderWidth: 5,
	borderColor: '#000',
	shadowColor: '#000',
	shadowOffset: { width: 8, height: 18},
	shadowOpacity: 0.99,
	shadowRadius: 5,
	elevation: 10,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  welcomeMsgText: {
	fontSize: 40,
	fontWeight: '100',
	textAlign: 'center',
	color: 'black',
	fontFamily: 'Jersey15',
  },
  loginPageButton:{
	alignItems: 'center',
	justifyContent: 'center',	
	textAlign: 'center',
	fontSize: 20,
	fontFamily: 'Jersey15',
  },
  buttonContainer: {
	width: 125,
	height: 50,
	justifyContent: 'center',
	backgroundColor: 'rgb(0, 212, 11)',
	borderRadius: 25,
	borderWidth: 2,
  }
});
