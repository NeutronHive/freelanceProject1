// Login.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";

const app = firebaseConfig();
const db = getFirestore(app);

async function getSubjects() {
  const querySnapshot = await getDocs(collection(db, "password"));
  const usersArray = [];

  querySnapshot.forEach((doc) => {
    usersArray.push({
      password: doc.data().password
    });
  });

  return usersArray;
}

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    getSubjects().then((data) => {
      setPasswords(data);
    });
  }, []);

  const handleLogin = () => {
    let isLogin = false;

    passwords.forEach((doc) => {
      if (doc.password === password) {
        localStorage.setItem('user', 'true');
        isLogin = true;
        window.location.reload();
      }
    });

    if (!isLogin) {
      alert('Incorrect password');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  title: {
    fontSize: '3rem',
    color: '#ff6666',
    marginBottom: '1rem',
  },
  input: {
    padding: '1rem',
    marginBottom: '1.5rem',
    border: '2px solid #ff6666',
    borderRadius: '8px',
    width: '300px',
    fontSize: '1.5rem',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.5rem',
    backgroundColor: '#ff6666',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default Login;
