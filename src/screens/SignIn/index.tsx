import React, { useEffect, useState } from 'react';
import { StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { InputPassword } from '../../components/InputPassword';
import theme from '../../styles/theme';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';


import {
Container,
Header,
Title,
SubTitle,
Footer,
Form,
} from './styles';
import { useAuth } from '../../hooks/auth';


export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()
  const { signIn } = useAuth();

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().required('Senha é obrigatória')
      })
  
      await schema.validate({email, password})

      signIn({email, password});
    } catch (error) {
      if(error instanceof Yup.ValidationError) {
        Alert.alert('Opa', error.message)
      } else {
        Alert.alert('Erro na autenticação')
      }
    }
  };

  function handleNewAccount() {
    navigation.navigate('SignUpFirstStep')
  }


return (
  <KeyboardAvoidingView
    behavior="position" enabled
  >
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
    <Container>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <Title>Estamos{'\n'}quase lá.</Title>
        <SubTitle>Faça seu login para começar{'\n'}uma experiência incrível</SubTitle>
      </Header>

      <Form>

        <Input
        iconName="mail"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
        />
        <InputPassword 
          iconName="lock"
          placeholder="Senha"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </Form>

      <Footer>
        <Button 
          title="Login"
          onPress={handleSignIn}
          enabled={true}
          loading={false}
        />
        <Button 
          title="Criar conta gratuita"
          color={theme.colors.background_seondary}
          onPress={handleNewAccount}
          enabled={true}
          loading={false}
          light
        />
      </Footer>
    </Container>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}