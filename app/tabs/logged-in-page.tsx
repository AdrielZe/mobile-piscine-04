import { ImageBackground, StyleSheet, SafeAreaView, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { useRouter } from 'expo-router';
import AuthSession, { resolveDiscoveryAsync } from 'expo-auth-session';
import { useAuth } from '../AuthContext';


WebBrowser.maybeCompleteAuthSession();

export default function LoggedInPage() {
		const {
			isLoggedIn,
			setIsLoggedIn,
			userInfo,
			setUserInfo,
		} = useAuth();
	const router = useRouter();
	const redirectUri =
		Platform.OS === 'ios'
		? 'com.googleusercontent.apps.230648280850-8dfin47lp9n9ofss1hojntihr1llmrd2:/oauthredirect'
		: 'https://auth.expo.io/asilveir/appzao'; 
	const [request, response, promptAsync] = Google.useAuthRequest({
		webClientId: '230648280850-8ias4poso58vsct6r1788c60958mos8l.apps.googleusercontent.com',
		iosClientId: '230648280850-8dfin47lp9n9ofss1hojntihr1llmrd2.apps.googleusercontent.com',
		redirectUri,
	}) 
	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('@user');
			setUserInfo(null);
			router.push('/');
			setIsLoggedIn(false);
			console.log('User logged out');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	}
	
	const getUserInfo = async (token : any) => {
		if (!token) return;
		try {
			const response = await fetch('https://www.googleapis.com/userinfo/v2/me',{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const user = await response.json();
			await AsyncStorage.setItem("@user", JSON.stringify(user));
			setUserInfo(user);
			console.log(token)
		} catch (error){

		}
	}

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/lofi-breath.webp')}
        style={styles.background}
      >
        <View style={styles.welcomeMsg}>
	  {<Text style={styles.welcomeMsgText}>{JSON.stringify(userInfo)}</Text>}
	  {<Text style={styles.welcomeMsgText} onPress={() => {
				router.push({
				pathname: '/',
	     			},)
				handleLogout();
			}}
	   > Logout </Text>}
        </View>
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
    shadowOffset: { width: 8, height: 18 },
    shadowOpacity: 0.99,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  welcomeMsgText: {
    fontSize: 40,
    fontWeight: '100',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Jersey15',
  },
  loginPageIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  iconLoginPage: {
    borderRadius: 50,
    borderWidth: 5,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
  },
});
