import React,  { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator, Alert, StatusBar } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from 'styled-components'
import  { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync'

import Logo from '../../assets/logo.svg'
import { Car } from '../../components/Car';

import { api } from '../../services/api';
import { CarDTO } from '../../dtos/carDTO'

import Animated, { 
    useSharedValue,
    
} from 'react-native-reanimated'



import {
Container,
Header,
TotalCars,
HeaderContent,
CarList,
} from './styles';
import { Load } from '../../components/Load';

import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';
import { database } from '../../databases';
import { Car as ModelCar} from '../../databases/model/Cars'

export function Home() {
    const [cars, setCars] = useState<ModelCar[]>([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation();
    const NetInfo = useNetInfo();


    function handleCarDetails(car: ModelCar) {
        navigation.navigate("CarDetails", { car })
    }


    const theme = useTheme()

    useEffect(() => {
        let isMounted = true;

        async function fetchCars() {
           try {
            const carCollection = database.get<ModelCar>('cars');
            const cars = await carCollection.query().fetch();


            if (isMounted) {
                setCars(cars)
            }
           } catch (error) {
               console.log(error)
           } finally {
               if (isMounted) {
                setLoading(false)
               }
           }
        }

        fetchCars();
        return () => {
            isMounted = false
        }

    }, []);

    useEffect(() => {
        if (NetInfo.isConnected === true) {
            offlineSynchronize();
        }
    }, [NetInfo.isConnected])

    async function offlineSynchronize() {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }) => {
                const response = await api.get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
                const { changes, latestVersion } = response.data;
                console.log(changes)
                return { changes, timestamp: latestVersion}
            },
            pushChanges: async ({ changes }) => {
                const user = changes.users;
                await api.post(`users/sync/`, user)
            }
        });
    }

return (
    <Container>
        <StatusBar
         barStyle="light-content"
         translucent
         backgroundColor="transparent"
         />
        <Header>
            <HeaderContent>
            <Logo 
            height={RFValue(12)}
            width={RFValue(108)}
            />
            { !loading ?
            <TotalCars>
                {`Total de ${cars.length} carros`}
            </TotalCars>
            : null}
            </HeaderContent>
        </Header>
        { loading ? <ActivityIndicator /> :
        <CarList
        data={cars}
        keyExtractor={item => String(item.id)}
        renderItem={( { item }) => <Car data={item} onPress={() => handleCarDetails(item)}/>}
        />
        }

    </Container>
  );
}