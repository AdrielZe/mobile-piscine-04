import { ImageBackground, StyleSheet, SafeAreaView, Text, View, Platform, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
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


console.log(userInfo?.picture)
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/lofi-breath.webp')}
        style={styles.background}
      >
        <View style={styles.welcomeMsg}>
	 <View style={styles.welcomeMsgOverlay} />

		<View style={styles.profileHeader}>
				<Image
				source={
				userInfo?.picture ? { uri: userInfo?.picture } : require('../../assets/images/default-avatar.png') 
				}
				style={styles.profileImage}
				/>
				<Text style={styles.profileHeaderText}>{userInfo?.name}</Text>
				<Text style={styles.profileHeaderText} onPress={handleLogout}><Ionicons name="log-out-outline" size={35} color="#000000" /></Text>
		</View>
		<View style={styles.mainSection}>
			<View style={styles.entryCard}>
				<View style={styles.entryCardDate}>
					<Text style={styles.entryCardDateText}>28</Text>
					<Text style={styles.entryCardDateText}>May</Text>
					<Text style={styles.entryCardDateText}>2025</Text>
				</View>
				<View style={styles.iconCard}>
					<FontAwesome name="smile-o" size={30} color="rgba(255, 255, 255, 1)" />
				</View>
				<View style={styles.iconLine}>
					
				</View>
				<View /*style={styles.cardTitle}*/>
					<Text style={styles.cardTitleText}>Test</Text>
				</View>
			</View>
		</View>
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
    flex: 0.9,
    width: '90%',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 18 },
    shadowOpacity: 0.99,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  
    textAlign: 'center',

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
  profileHeader:
  {
	flex: 0.1,
	padding: 30,
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
	borderBottomColor:'rgba(0, 0, 0, 0.5)',
	borderBottomWidth: 5,
	gap: 25,
  },
  profileHeaderText:{
	fontFamily: 'Jersey15',
	color: 'black',
	opacity: 0.7,
	alignItems: 'center',
	textAlign: 'center',
	fontSize: 25,
  },
  profileImage: {
	width: 60,
	height: 60,
	borderRadius: 50, // Faz a borda circular
	overflow: 'hidden', // Garante que a imagem fique dentro do círculo
	marginRight: 10, // Espaço entre a foto e o nome
	borderWidth: 2,
	borderColor: 'white',
  },welcomeMsgOverlay: {
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: 'rgba(255, 255, 255, 0.3)', // Apenas o fundo opaco
	borderRadius: 10,
},mainSection:{
	padding: 10,
},
entryCard: {
	alignItems: 'center',
	justifyContent: 'space-evenly',
	width: '100%',
	height: 100,
	borderWidth: 3,
	flexDirection: 'row',
	backgroundColor: 'rgb(212, 189, 238)', // Fundo branco para destacar a sombra
	borderRadius: 10, // Bordas arredondadas para suavizar o efeito
	elevation: 5, // Para Android, ajusta a sombra
	shadowColor: '#000', // Cor da sombra no iOS
	shadowOffset: { width: 4, height: 4 }, // Direção da sombra
	shadowOpacity: 0.3, // Intensidade da sombra
	shadowRadius: 4, // Espessura da sombra
     },entryCardDate:{
	flexDirection: 'column',
	textAlign: 'center',
	justifyContent: 'center',
	alignItems: 'center',
},entryCardDateText: {
	fontFamily: 'Jersey15',
	fontSize: 25,
	color: 'rgb(0, 255, 34)', // Cor principal do texto
	textShadowColor: 'black', // Cor do contorno
	textShadowOffset: { width: -1, height: 1 }, // Direção do contorno
	textShadowRadius: 1, // Espessura do contorno
     },
     iconLine:{
	width:2,
	height: '60%',
	backgroundColor: 'black',
     },
     cardTitleText:{
	fontFamily: 'Jersey15',
	fontSize:50,
	color: 'rgb(0, 0, 0)', 
     }
});
