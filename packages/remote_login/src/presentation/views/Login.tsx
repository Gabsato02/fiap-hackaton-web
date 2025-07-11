import React, { useEffect } from 'react';
import * as firebaseui from 'firebaseui';
// ✅ 1. IMPORTE OS TIPOS 'Auth' E 'UserCredential'
import {
  getAuth,
  GoogleAuthProvider,
  EmailAuthProvider,
  onAuthStateChanged,
  Auth,
  UserCredential,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import Grid from '@mui/material/Grid';
import coverImage from '../assets/cover-image.png';
import Card from '@mui/material/Card';
import { useUserStore } from 'hostApp/store';
import { FIREBASE_CONFIG } from 'hostApp/vars';

initializeApp(FIREBASE_CONFIG);

export default function Login() {
  const { setUserInfo } = useUserStore();

  useEffect(() => {
    const auth = getAuth();

    // ✅ 2. ADICIONE O TIPO 'Auth' AO PARÂMETRO
    const checkUserAuthentication = (auth: Auth) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const userData = {
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

    const uiConfig = {
      callbacks: {
        // ✅ 3. ADICIONE O TIPO 'UserCredential' AO PARÂMETRO
        signInSuccessWithAuthResult: function (authResult: UserCredential) {
          const { user } = authResult;

          const userData = {
            // @ts-ignore // A propriedade accessToken não existe no tipo User padrão, mas é injetada pelo provider. Ignoramos o erro de tipo aqui.
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
