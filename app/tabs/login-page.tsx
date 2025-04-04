import { ImageBackground, StyleSheet, SafeAreaView, Text, View, Platform, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../AuthContext';
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";


const GITHUB_CLIENT_ID = "Ov23liNwqUaxFuJFtS7D";
const GITHUB_CLIENT_SECRET = "3ecd0827f3ea7f5182c534b05dceaf1d08037752";
const REDIRECT_URI = AuthSession.makeRedirectUri();

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
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
	const [githubRequest, githubResponse, githubPromptAsync] = AuthSession.useAuthRequest({
		clientId: "Ov23liNwqUaxFuJFtS7D",
		scopes: ["read:user"],
		redirectUri: REDIRECT_URI,
	},
	{ authorizationEndpoint: "https://github.com/login/oauth/authorize"}
	);

// async function saveUserToFirestore(user: any) {
//   await setDoc(doc(db, "users", user.uid), {
//     name: user.displayName,
//     email: user.email,
//     photoURL: user.photoURL,
//   });
// }

	React.useEffect(() => {
		console.log("Response:", response);
		handleSignInWithGoogle();
	   }, [response]);
	   
	 
	   const fetchToken = async (code: string) => {
		try {
		  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
		    method: "POST",
		    headers: {
		      Accept: "application/json",
		      "Content-Type": "application/json",
		    },
		    body: JSON.stringify({
		      client_id: GITHUB_CLIENT_ID,
		      client_secret: GITHUB_CLIENT_SECRET,
		      code,
		    }),
		  });
	     
		  const { access_token } = await tokenResponse.json();
	     
		  const userResponse = await fetch("https://api.github.com/user", {
		    headers: { Authorization: `Bearer ${access_token}` },
		  });
	     
		  const userData = await userResponse.json();
		  await SecureStore.setItemAsync("github_token", access_token);
		  await AsyncStorage.setItem("@user", JSON.stringify(userData));
		//  saveUserEntry(userData.id, userData)
	     
		  setUserInfo(userData);
		  setIsLoggedIn(true);
		  router.replace("./logged-in-page");
		} catch (error) {
		  Alert.alert("Erro", "Falha ao obter token do GitHub");
		}
	     };
	
	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('@user');
			setUserInfo(null);
			router.push('/');
			console.log('User logged out');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	}

	const getUserInfo = async (token : any) => {
		if (!token)return;
		try {
			const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const user = await response.json();
			await AsyncStorage.setItem("@user", JSON.stringify(user));
			setUserInfo(user);
		} catch (error){
			console.log("erro");
		}
	}
	console.log("Redirect URI:", request?.redirectUri);
	const isAuthenticated =  () => {
		return userInfo != null;
	}

	const handleGitHubLogin = async () => {
		try {
		  const githubResponse = await githubPromptAsync();
		  const user = await AsyncStorage.getItem("@user");
		  if (githubResponse.type === "success" && githubResponse.params.code) {
			setIsLoggedIn(true);
			router.push('./logged-in-page');
			const code = githubResponse.params.code;
			// saveUserToFirestore(user);
			await fetchToken(code);
		  }
		} catch (error) {
		  Alert.alert("Erro", "Falha ao fazer login com GitHub");
		}
	     };
	
	async function handleSignInWithGoogle() {
		const user = await AsyncStorage.getItem("@user");
		if (!user) {
			if(response?.type === 'success') {
				setIsLoggedIn(true);
				router.push('./logged-in-page');
				// saveUserToFirestore(user)
				await getUserInfo(response.authentication?.accessToken)
			}
		} else {
			console.log("Login cancelado ou falhou:", response);
			setUserInfo(JSON.parse(user));
		}
	}


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/lofi-breath.webp')}
        style={styles.background}
      >
        <View style={styles.welcomeMsg}>
          <Text style={styles.welcomeMsgText}>Log in with:</Text>
          <View style={styles.loginPageIcons}>
            <Ionicons
              style={styles.iconLoginPage}
              name="logo-google"
              size={40}
              color="#000000"
		onPress={() => request ? promptAsync() : console.log("Request não está pronto")}
            />
            <Ionicons style={styles.iconLoginPage} name="logo-github" size={40} color="#000000" onPress={handleGitHubLogin} />
          </View>
	   <Text style={styles.welcomeMsgText} 	     onPress={() => router.replace({
		pathname: '/',
	     })}> Back to login page </Text>
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
    padding: 20,
    width: '100%',
  },
  iconLoginPage: {
    borderRadius: 50,
    borderWidth: 5,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
  },
});
