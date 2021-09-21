
import React from 'react';
import {
  useFonts,
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
} from '@expo-google-fonts/archivo'
import {
  Inter_400Regular,
  Inter_500Medium,
} from '@expo-google-fonts/inter'
import { ThemeProvider } from 'styled-components';

import AppLoading from 'expo-app-loading'
import { Home } from './src/screens/Home';
import theme from './src/styles/theme';

import { Routes } from './src/routes';
import { AppProvider } from './src/hooks';

export default function App() {

  const [fonstLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
  })

  if (!fonstLoaded){

    return  <AppLoading />
  }
  return (

    <ThemeProvider theme={theme}>
      <AppProvider>
        <Routes/>
      </AppProvider>
    </ThemeProvider>
  );
}
