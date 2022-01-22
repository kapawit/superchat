import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { signInWithPopup } from 'firebase/auth';
import { useRef, useState } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyBYhuhN5R40sMSnFuYPJUAH5Ac8bJWH96E",
  authDomain: "superchat-f9dd7.firebaseapp.com",
  projectId: "superchat-f9dd7",
  storageBucket: "superchat-f9dd7.appspot.com",
  messagingSenderId: "273773700985",
  appId: "1:273773700985:web:241282026d8f3f78d871a8",
  measurementId: "G-LWWR40XCKW"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>LiveChat</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('')
  
  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid,photoURL } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type='submit' disabled={!formValue}>✈️</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const {text,uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
  <div className={`message ${messageClass}`}>
    <img src={photoURL}/>
    <p>{text}</p>
  </div>
  )
}
export default App;
