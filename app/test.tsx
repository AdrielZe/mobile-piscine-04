import { ImageBackground, StyleSheet, SafeAreaView, Text, Animated, Easing, View, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router'

export default function LoginPage() {


  return (
	<SafeAreaView style={styles.container}>
		<ImageBackground
			source={require('../assets/images/lofi-breath.webp')}
			style={styles.background}

		>
		</ImageBackground>
	</SafeAreaView>
  );
}

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
	//color: 'rgba(17, 0, 255, 0.6)',
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
