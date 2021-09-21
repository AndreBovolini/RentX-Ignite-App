import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import * as Yup from 'yup';

import {
Container,
Header,
Steps,
Title, 
Subtitle,
Form,
FormTitle,
} from './styles';


export function SignUpFirstStep() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [driverLicense, setDriverLicense] = useState('')
    
    const navigation = useNavigation();


    function handleBack() {
        navigation.goBack();
    }

    

    async function handleNextStep() {
        try{
            const schema = Yup.object().shape({
                driverLicense: Yup.string().required('CNH é obrigatória'),
                email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
                name: Yup.string().required('Nome é obrigatório'),
            })

            const data = {name, email, driverLicense}

            await schema.validate(data);
            navigation.navigate('SignUpSecondStep', { user: data})

        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                return Alert.alert('Opa', error.message)
            }
        }
    }


return (
    <Container>
        <Header>
            <BackButton onPress={handleBack}/>
            <Steps>
                <Bullet active/>
                <Bullet />
            </Steps>
        </Header>
        <KeyboardAvoidingView behavior="position" enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Title>Crie sua{'\n'}conta</Title>
        <Subtitle>Faça seu cadastro de{'\n'}forma fácil e rápida</Subtitle>

        <Form>
            <FormTitle>1. Dados</FormTitle>
            <Input 
                iconName="user"
                placeholder="nome"
                onChangeText={setName}
                value={name}
            />
            <Input 
                iconName="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
            />
            <Input 
                iconName="credit-card"
                placeholder="CNH"
                keyboardType="numeric"
                onChangeText={setDriverLicense}
                value={driverLicense}
            />
        </Form>

        <Button 
            title="Próximo"
            onPress={handleNextStep}
        />
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </Container>
  );
}