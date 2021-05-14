import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import Filter from 'bad-words'
import { ref, onUnmounted, computed } from 'vue'

firebase.initializeApp({
  apiKey: 'AIzaSyATH0lbPUU5P86AnAM8zEVg1K4awbGQSp0',
  authDomain: 'battlewagon-c310d.firebaseapp.com',
  projectId: 'battlewagon-c310d',
  storageBucket: 'battlewagon-c310d.appspot.com',
  messagingSenderId: '280534857961',
  appId: '1:280534857961:web:2cd8ee3a30d36f5f5f5878'
})

const auth = firebase.auth()

export function useAuth() {
  const user = ref(null)
  const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
  onUnmounted(unsubscribe)
  const isLogin = computed(() => user.value !== null)

  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(googleProvider)
  }
  const signOut = () => auth.signOut()

  return { user, isLogin, signIn, signOut }
}

const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)
const filter = new Filter()

export function useChat() {
  const messages = ref([])
  const unsubscribe = messagesQuery.onSnapshot(snapshot => {
    messages.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .reverse()
  })
  onUnmounted(unsubscribe)

  const { user, isLogin } = useAuth()
  const sendMessage = text => {
    if (!isLogin.value) return
    const { photoURL, uid, displayName } = user.value
    messagesCollection.add({
      userName: displayName,
      userId: uid,
      userPhotoURL: photoURL,
      text: filter.clean(text),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  return { messages, sendMessage }
}

//Maps
const mapCollection = firestore.collection('map')

export const createMap = map => {
  return mapCollection.add(map)
}

export const getMap = async id => {
  const map = await mapCollection.doc(id).get()
  return map.exists ? map.data() : null
}

export const updateMap = (id, map) => {
  return mapCollection.doc(id).update(map)
}

export const deleteMap = id => {
  return mapCollection.doc(id).delete()
}

export const useLoadMaps = () => {
  const maps = ref([])
  const close = mapCollection.onSnapshot(snapshot => {
    maps.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
  })
  onUnmounted(close);
  return maps
}