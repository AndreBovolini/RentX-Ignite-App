import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { InputPassword } from '../../../components/InputPassword';
import { api } from '../../../services/api';

import {
Container,
Header,
Steps,
Title, 
Subtitle,
Form,
FormTitle,
} from './styles';

interface Params {
    user: {
        name: string,
        email: string;
        driverLicense: string;
    }
}

export function SignUpSecondStep() {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm ] = useState('')
    
    const navigation = useNavigation();

    const route = useRoute();

    const { user } = route.params as Params;

    const theme = useTheme();

    function handleBack() {
        navigation.goBack();
    }

    async function handleRegister() {
        if(!password || !passwordConfirm) {
            return Alert.alert('Informe a senha e a confirmação')
        }

        if(password != passwordConfirm) {
            return Alert.alert('As senhas não são iguais')
        }

        await api.post('/users', {
            name: user.name,
            email: user.email,
            driver_license: user.driverLicense,
            password,
        })
        .then(() => {
            navigation.navigate("Confirmation", {
                nextScreenRoute: "SignIn",
                title: 'Conta Criada!',
                message: `Agora é só fazer login\ne aproveitar`
            });
        })
        .catch((error) => {
            console.warn(user.driverLicense)
            Alert.alert("Erro",'Não foi possível cadastrar')
        });
       
        
    }


return (
    <Container>
        <Header>
            <BackButton onPress={handleBack}/>
            <Steps>
                <Bullet />
                <Bullet active />
            </Steps>
        </Header>
        <KeyboardAvoidingView behavior="position" enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Title>Crie sua{'\n'}conta</Title>
        <Subtitle>Faça seu cadastro de{'\n'}forma fácil e rápida</Subtitle>

        <Form>
            <FormTitle>2. Senha</FormTitle>
            <InputPassword
                iconName="lock"
                placeholder="Senha"
                onChangeText={setPassword}
                value={password}
            />
            <InputPassword
                iconName="lock"
                placeholder="Repetir senha"
                onChangeText={setPasswordConfirm}
                value={passwordConfirm}
            />
        </Form>

        <Button 
            title="Cadastrar"
            color={theme.colors.success}
            onPress={handleRegister}
        />
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </Container>
  );
}