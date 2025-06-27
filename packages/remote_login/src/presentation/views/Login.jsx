import React, { useEffect } from 'react';
import * as firebaseui from 'firebaseui';
import { getAuth, GoogleAuthProvider, EmailAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import Grid from '@mui/material/Grid';
import coverImage from '../assets/cover-image.png';
import Card from '@mui/material/Card';
import { useUserStore } from 'hostApp/store';

const firebaseConfig = {
  apiKey: 'AIzaSyA73aVkVYsp3JD7jOs_Yylimq4vY9IxvEo',
  authDomain: 'fiap-m05-hackaton.firebaseapp.com',
  projectId: 'fiap-m05-hackaton',
  storageBucket: 'fiap-m05-hackaton.firebasestorage.app',
  messagingSenderId: '401659988517',
  appId: '1:401659988517:web:fe278a599fd1aaadad8dcc',
};

initializeApp(firebaseConfig);

export default function Login() {
  const { setUserInfo } = useUserStore();

  useEffect(() => {
    const auth = getAuth();

    const checkUserAuthentication = (auth) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const userData = {
            token: firebaseUser.accessToken,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photo_url: firebaseUser.photoURL,
            id: firebaseUser.uid,
          };

          setUserInfo(userData);
        } else {
          setUserInfo({});
        }
        unsubscribe();
      });
    };

    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    ui.languageCode = 'pt-BR';

    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
          const { user } = authResult;

          const userData = {
            token: user.accessToken,
            email: user.email,
            name: user.displayName,
            photo_url: user.photoURL,
            id: user.uid,
          };

          setUserInfo(userData);
          return false;
        },
      },
      signInFlow: 'popup',
      signInOptions: [GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID],
    };

    ui.start('#firebaseui-auth-container', uiConfig);
    checkUserAuthentication(auth);
  }, [setUserInfo]);

  return (
    <Grid container spacing={2}>
      <Card
        sx={{
          width: '100%',
          height: '600px',
          position: 'relative',
          background: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Card
          sx={{
            padding: 5,
            height: '100%',
            minWidth: '320px',
            width: 'fit-content',
            marginLeft: 'auto',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <div id="firebaseui-auth-container"></div>
        </Card>
      </Card>
    </Grid>
  );
}
