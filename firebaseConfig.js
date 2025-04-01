import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
	apiKey: '',
	authDomain: 'diaryapp-fb4e2.firebaseapp.com',
	projectId: 'diaryapp-fb4e2',
	storageBucket: 'diaryapp-fb4e2.appspot.com',
	messagingSenderId: '1011470428005',
	appId: "1:1011470428005:web:7e54889cceccc645f1a38c",
	measurementId: "G-FDZRTFPX6K"
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// if (!firebase.apps.length) {
// 	firebase.initializeApp(firebaseConfig);
//      } else {
// 	firebase.app();
//      }
     
export default firebase;