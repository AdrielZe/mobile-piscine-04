import { useState } from 'react';
import { 
  ImageBackground, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { 
	collection, 
	query, 
	where, 
	getDocs, 
	addDoc, 
	deleteDoc,
	doc,
	onSnapshot 
     } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ajuste o caminho conforme sua configuração
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../AuthContext';

export default function LoggedInPage() {
  const {
    isLoggedIn,
    setIsLoggedIn,
    userInfo,
    setUserInfo,
  } = useAuth();
  
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({
    title: '',
    message: '',
    mood: 'smile-o',
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  });
  
  const [cards, setCards] = useState([
    { id: 1, date: '28 May 2025', mood: 'smile-o', title: 'Test', message: 'Esta é a mensagem dentro do card.' },
    { id: 2, date: '29 May 2025', mood: 'meh-o', title: 'Outro Teste', message: 'Outra mensagem de exemplo.' }
  ]);

  const moods = [
    { name: 'smile-o', label: 'Feliz' },
    { name: 'meh-o', label: 'Neutro' },
    { name: 'frown-o', label: 'Triste' },
    { name: 'flask', label: 'Curioso' },
    { name: 'heart', label: 'Apaixonado' }
  ];

  const handleCardPress = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const handleAddCard = () => {
    const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
    const cardToAdd = {
      id: newId,
      ...newCard
    };
    setCards([...cards, cardToAdd]);
    setShowAddModal(false);
    setNewCard({
      title: '',
      message: '',
      mood: 'smile-o',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    });
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/lofi-breath.webp')}
        style={styles.background}
      >
          <View style={styles.profileHeader}>
            <Image
              source={
                userInfo?.picture ? { uri: userInfo?.picture } : require('../../assets/images/default-avatar.png') 
              }
              style={styles.profileImage}
            />
            <Text style={styles.profileHeaderText}>{userInfo?.name}</Text>
            <Text style={styles.profileHeaderText} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={35} color="#000000" />
            </Text>
          </View>
        <View style={styles.welcomeMsg}>
          <View style={styles.welcomeMsgOverlay} />

          
          <ScrollView style={styles.mainSection}>
            {cards.map((card) => (
              <TouchableOpacity key={card.id} onPress={() => handleCardPress(card)}>
                <View style={styles.entryCard}>
                  <View style={styles.entryCardDate}>
                    <Text style={styles.entryCardDateText}>{card.date.split(' ')[0]}</Text>
                    <Text style={styles.entryCardDateText}>{card.date.split(' ')[1]}</Text>
                    <Text style={styles.entryCardDateText}>{card.date.split(' ')[2]}</Text>
                  </View>
                  <View style={styles.iconCard}>
                    <FontAwesome name={card.mood} size={30} color="rgba(255, 255, 255, 1)" />
                  </View>
                  <View style={styles.iconLine} />
                  <View style={styles.titleContainer}>
                    <Text 
                      style={styles.cardTitleText} 
                      numberOfLines={1} 
                      ellipsizeMode="tail"
                    >
                      {card.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <TouchableOpacity 
          onPress={() => setShowAddModal(true)} 
          style={styles.addNewEntryButton}
        >
          <Text style={styles.addNewEntryButtonText}>Add new card</Text>
        </TouchableOpacity>
      </ImageBackground>

      {selectedCard && (
        <Modal animationType="fade" transparent={true} visible={!!selectedCard} onRequestClose={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.openedCard}>
              <Text style={styles.modalTitle}>{selectedCard.title}</Text>
              <Text style={styles.modalTitle}>
                <FontAwesome name={selectedCard.mood} size={30} color="rgba(255, 255, 255, 1)" />
              </Text>
              <Text style={styles.openedCardDateText}>
                {selectedCard.date.split(' ')[0]}, {selectedCard.date.split(' ')[1]} {selectedCard.date.split(' ')[2]}
              </Text>
              <Text style={styles.modalMessage}>{selectedCard.message}</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
 
      {showAddModal && (
        <Modal animationType="fade" transparent={true} visible={showAddModal} onRequestClose={() => setShowAddModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.addCardModal}>
		<ScrollView>
              <Text style={styles.modalTitle}>Novo Card</Text>
              
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.dateText}>{newCard.date}</Text>
              
              <Text style={styles.label}>Humor:</Text>
              <View style={styles.moodContainer}>
                {moods.map((mood) => (
                  <TouchableOpacity 
                    key={mood.name}
                    onPress={() => setNewCard({...newCard, mood: mood.name})}
                    style={[
                      styles.moodOption,
                      newCard.mood === mood.name && styles.selectedMood
                    ]}
                  >
                    <FontAwesome name={mood.name} size={24} color="#000" />
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.label}>Título:</Text>
              <TextInput
                style={styles.input}
                value={newCard.title}
                onChangeText={(text) => setNewCard({...newCard, title: text})}
                placeholder="Digite o título"
              />
              
		<TextInput
		style={[styles.input, styles.multilineInput]}
		value={newCard.message}
		onChangeText={(text) => setNewCard({...newCard, message: text})}
		placeholder="Digite sua mensagem"
	
		returnKeyType="done" // Mantém o comportamento padrão de nova linha

		/>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  onPress={() => setShowAddModal(false)} 
                  style={[styles.modalButton, styles.cancelButton]}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleAddCard} 
                  style={[styles.modalButton, styles.saveButton]}
                  disabled={!newCard.title || !newCard.message}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
		</ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
    flex: 0.85,
    width: '95%',
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
	flex: 0.05,
	padding: 30,
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
	gap: 25,
  },
  profileHeaderText:{
	fontFamily: 'Jersey15',
	color: 'white',
	opacity: 0.7,
	alignItems: 'center',
	textAlign: 'center',
	fontSize: 25,
  },
  profileImage: {
	width: 60,
	height: 60,
	borderRadius: 50,
	overflow: 'hidden',
	marginRight: 10,
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
	gap: 20,
},
entryCard: {
	alignItems: 'center',
	justifyContent: 'space-around',
	width: '100%',
	height: 90,
	borderWidth: 3,
	flexDirection: 'row',
	backgroundColor: 'rgb(212, 189, 238)',
	borderRadius: 10,
	elevation: 5,
	shadowColor: '#000',
	shadowOffset: { width: 4, height: 4 },
	shadowOpacity: 0.3,
	shadowRadius: 4,
	paddingHorizontal: 10,
     },
     entryCardDate:{
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
     openedCardDateText: {
	fontFamily: 'Jersey15',
	fontSize: 25,
	color: 'rgb(0, 255, 34)',
	textShadowColor: 'black',
	textShadowOffset: { width: -1, height: 1 },
	textShadowRadius: 1,
     },
     iconLine:{
	width:2,
	height: '60%',
	backgroundColor: 'black',
     },
     titleContainer: {
	flex: 0.5,
	marginLeft: 10,
	justifyContent: 'center',
     },
     cardTitleText: {
	fontFamily: 'Jersey15',
	fontSize: 24, // Reduzi um pouco o tamanho para caber melhor
	color: 'rgb(0, 0, 0)',
	overflow: 'hidden',
     },
     modalOverlay: {
	flex: 1,
	backgroundColor: 'rgba(0, 0, 0, 0.6)',
	justifyContent: 'center',
	alignItems: 'center'
},	openedCard: {
	backgroundColor: 'rgba(202, 161, 255, 0.8)',
	width: '80%',
	borderWidth: 3,
	padding: 20,
	borderRadius: 10,
	alignItems: 'center',
	shadowColor: '#000',
	shadowOffset: { width: 0, height: 4 },
	shadowOpacity: 0.3,
	shadowRadius: 5,
	elevation: 10
},	modalTitle: { fontFamily: 'Jersey15', fontSize: 25, fontWeight: 'bold', marginBottom: 10},
	modalMessage: { fontSize: 20, textAlign: 'center', marginBottom: 20, fontFamily: 'Jersey15' },
	closeButton: { backgroundColor: 'rgb(0, 212, 11)', padding: 10, borderRadius: 5, },
addNewEntryButtonText: { color: 'white', fontSize: 20,  fontFamily: 'Jersey15',},
	addNewEntryButton: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgb(0, 212, 11)', padding: 10, borderRadius: 5,
		height: 60,
		width: 150,
		borderWidth: 3,
	},  addCardModal: {
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		width: '90%',
		padding: 20,
		borderRadius: 10,
		maxHeight: '40%',
		overflow: 'scroll',
	     },
	     label: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 10,
		marginBottom: 5,
		color: '#333',
	     },
	     dateText: {
		fontSize: 16,
		marginBottom: 15,
		color: '#555',
	     },
	     input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		backgroundColor: '#fff',
	     },
	     multilineInput: {
		height: 100,
		textAlignVertical: 'top',
	     },
	     moodContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 15,
	     },
	     moodOption: {
		alignItems: 'center',
		padding: 10,
		borderRadius: 5,
		margin: 5,
		width: '30%',
	     },
	     selectedMood: {
		backgroundColor: 'rgba(212, 189, 238, 0.5)',
		borderWidth: 1,
		borderColor: 'rgb(212, 189, 238)',
	     },
	     moodLabel: {
		marginTop: 5,
		fontSize: 12,
	     },
	     modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	     },
	     modalButton: {
		padding: 10,
		borderRadius: 5,
		width: '48%',
		alignItems: 'center',
	     },
	     cancelButton: {
		backgroundColor: '#ccc',
	     },
	     saveButton: {
		backgroundColor: 'rgb(0, 212, 11)',
	     },
	     buttonText: {
		color: '#fff',
		fontWeight: 'bold',
	     },
});
