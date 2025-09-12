//ESTE CONTEXTO LO QUE NOS GARANTIZA ES QUE CUANDO LA APP PASE A SEGUNDO PLANO SE BLOQUEE (ESTEN TODOS LOS TABS Y NO HAGA NADA HASTA QUE SE VUELVA A ACTIVAR COMO APP EN INICIO)

import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { router } from 'expo-router';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'UserInactivity',
})

const LOCK_TIME = 3000

export const UserInactivityProvider = ({ children }: { children: React.ReactNode }) => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange )

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('appState', appState.current, nextAppState);

    //MUESTRA EL OVERLAY SI LA APP PASA A INACTIVO
    if ( nextAppState === 'inactive' ) {
      router.push('/(modal)/overlay');
    } else {
      if ( router.canGoBack()) {
        router.back();
      }
    }

    //SI LA APP PASA A BACKGROUND INICIA EL TIMER PARA BLOQUEAR
    if (nextAppState === 'background') {
      recordStartTime()
    } else if (nextAppState === 'active' && appState.current === 'background') {
      const startTime = storage.getNumber('startTime') 
      if ( startTime && Date.now() - startTime > LOCK_TIME ) {
        router.push('/(modal)/lock')
      }
    }

    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    storage.set('startTime', Date.now())
  }



  return <>{children}</>;
};

export default UserInactivityProvider;