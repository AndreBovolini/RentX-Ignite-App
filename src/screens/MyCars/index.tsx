import React, { useEffect, useState } from 'react';

import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';
import { StatusBar, FlatList, ActivityIndicator } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { format, parseISO } from 'date-fns'

import {
Container,
Header,
Title,
SubTitle,
Content,
Appointments,
AppointmentsTitle,
AppointmentsQuantity,
CarWrapper,
CarFooter,
CarFooterTitle,
CarFooterPeriod,
CarFooterDate,
} from './styles';
import { BackButton } from '../../components/BackButton';
import { useNavigation, useIsFocused } from '@react-navigation/core';
import { useTheme } from 'styled-components';
import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../databases/model/Cars';
import { Load } from '../../components/Load';


interface DataProps {
    id: string;
    car: ModelCar;
    start_date: string;
    end_date: string;
}


export function MyCars() {
    const [cars, setCars] = useState<DataProps[]>([])
    const [loading, setLoading] = useState(true);
    const screenIsFoccused = useIsFocused();

    const navigation = useNavigation();

    const theme = useTheme()

    function handleBack(){
        navigation.goBack()
    }


    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('/rentals');
                const dataFormatted = response.data.map((data: DataProps) => {
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
                        start_end: format(parseISO(data.end_date), 'dd/MM/yyyy'),
                    }
                })
                setCars(dataFormatted)
            } catch (error){
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchCars();
    }, [screenIsFoccused])

return (
    <Container>
        <Header>
        <StatusBar 
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
        />
            <BackButton onPress={handleBack} color={theme.colors.shape}/>

            <Title>
                Seus agendamentos, {'\n'}
                    estão aqui
            </Title>
            <SubTitle>
                Conforto, segurança e praticidade
            </SubTitle>

        </Header>
    { loading ? <ActivityIndicator /> :
    <Content>
    <Appointments>
        <AppointmentsTitle>
            Agendamentos feitos
        </AppointmentsTitle>
        <AppointmentsQuantity>
            {cars.length}
        </AppointmentsQuantity>
    </Appointments>

    <FlatList 
        data={cars}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
            <CarWrapper>
            <Car data={item.car} />
            <CarFooter>
                <CarFooterTitle>Período</CarFooterTitle>
                <CarFooterPeriod>
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign 
                        name="arrowright"
                        size={20}
                        color={theme.colors.title}
                        style={{ marginHorizontal: 10}}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
                </CarFooterPeriod>
            </CarFooter>
            </CarWrapper>
        )}
    />
    </Content> 
    }
    </Container>
  );
}