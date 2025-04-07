import { ImageBackground, StyleSheet, SafeAreaView, Text, View, Platform, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

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
		setIsLoggedIn,
		setUserInfo,
	} = useAuth();

	const router = useRouter();
	const [request, response, promptAsync] = Google.useAuthRequest({
		webClientId: '230648280850-8ias4poso58vsct6r1788c60958mos8l.apps.googleusercontent.com',
		iosClientId: '230648280850-8dfin47lp9n9ofss1hojntihr1llmrd2.apps.googleusercontent.com',
		redirectUri: 'com.googleusercontent.apps.230648280850-8dfin47lp9n9ofss1hojntihr1llmrd2:/oauthredirect',
	}) 
	const [githubRequest, githubResponse, githubPromptAsync] = AuthSession.useAuthRequest({
		clientId: "Ov23liNwqUaxFuJFtS7D",
		scopes: ["read:user"],
		redirectUri: 'exp://10.11.6.3:8081',
	},
	{ authorizationEndpoint: "https://github.com/login/oauth/authorize"}
	);

	React.useEffect(() => {
		handleSignInWithGoogle();
	   }, [response]);

	const fetchGitHubUser = async (code: string) => {
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
	     
		  if (!access_token) {
		    throw new Error("Erro ao obter token do GitHub");
		  }
	     
		  const userResponse = await fetch("https://api.github.com/user", {
		    headers: { Authorization: `Bearer ${access_token}` },
		  });
	     
		  const userData = await userResponse.json();
	     
		  await SecureStore.setItemAsync("github_token", access_token);
		  await AsyncStorage.setItem("@user", JSON.stringify(userData));
	     
		  setUserInfo(userData);
		  setIsLoggedIn(true);
		  router.replace("./logged-in-page");
	     
		} catch (error) {
		  Alert.alert("Erro", "Falha ao obter dados do GitHub");
		  console.error("Erro ao buscar usuário GitHub:", error);
		}
	     };
	     
	     
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
			console.log("error");
		}
	}

	const handleGitHubLogin = async () => {
		try {
		  const githubResponse = await githubPromptAsync();
	     
		  if (githubResponse.type === "success" && githubResponse.params.code) {
			const code = githubResponse.params.code;
			await fetchGitHubUser(code);
		  }
		} catch (error) {
		  Alert.alert("Error", "Failed login with github.");
		}
	     };
	
	async function handleSignInWithGoogle() {
		const user = await AsyncStorage.getItem("@user");
		if (!user) {
			if(response?.type === 'success') {
				setIsLoggedIn(true);
				router.push('./logged-in-page');
				await getUserInfo(response.authentication?.accessToken)
			}
		} else {
			console.log("Login canceled or failed", response);
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
		onPress={() => request ? promptAsync() : console.log("Request is not ready")}
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