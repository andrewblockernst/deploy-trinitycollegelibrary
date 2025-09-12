import React from 'react';
import { Stack } from 'expo-router'; 
import { UserInactivityProvider } from './context/UserInactivity';

export default function RootLayout() {
  return (
    <UserInactivityProvider>
    <Stack>
      <Stack.Screen name='index' />
      <Stack.Screen name='(modal)/lock' options={{ headerShown: false }} />
      <Stack.Screen name='(modal)/overlay' options={{ headerShown: false, animation: 'fade', animationDuration: 500, }} />
    </Stack>
    </UserInactivityProvider>
  );
}